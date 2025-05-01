import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { getMonthlyTarget, saveMonthlyTarget } from '../components/firebase/addMonthlyTarget';

function Settings() {
  const [cashValues, setCashValues] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);
  const [targetSpending, setTargetSpending] = useState('0');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [newCashValue, setNewCashValue] = useState('');
  const [newQuickNote, setNewQuickNote] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [savingTarget, setSavingTarget] = useState(false);

  useEffect(() => {
    // Load saved values from localStorage
    const savedCashValues = JSON.parse(localStorage.getItem('cashValues')) || [1, 2, 5, 10, 20, 50];
    const savedQuickNotes = JSON.parse(localStorage.getItem('quickNotes')) || [
      'Groceries',
      'Transport',
      'Entertainment',
      'Utilities',
      'Rent',
      'Shopping',
    ];
    setCashValues(savedCashValues);
    setQuickNotes(savedQuickNotes);

    // Fetch target spending
    const fetchTarget = async () => {
      try {
        const userId = localStorage.getItem('id');
        if (userId) {
          const target = await getMonthlyTarget(userId);
          setTargetSpending(target);
        }
      } catch (error) {
        console.error('Error fetching target:', error);
        setTargetSpending(localStorage.getItem('targetSpending') || '0');
      }
    };
    fetchTarget();
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    window.location.reload(); // Reload to apply language changes
  };

  const handleAddCashValue = () => {
    if (newCashValue && !isNaN(newCashValue)) {
      const updatedValues = [...cashValues, parseFloat(newCashValue)].sort((a, b) => a - b);
      setCashValues(updatedValues);
      localStorage.setItem('cashValues', JSON.stringify(updatedValues));
      setNewCashValue('');
    }
  };

  const handleRemoveCashValue = (value) => {
    const updatedValues = cashValues.filter(v => v !== value);
    setCashValues(updatedValues);
    localStorage.setItem('cashValues', JSON.stringify(updatedValues));
  };

  const handleAddQuickNote = () => {
    if (newQuickNote.trim()) {
      const updatedNotes = [...quickNotes, newQuickNote.trim()];
      setQuickNotes(updatedNotes);
      localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
      setNewQuickNote('');
    }
  };

  const handleRemoveQuickNote = (note) => {
    const updatedNotes = quickNotes.filter(n => n !== note);
    setQuickNotes(updatedNotes);
    localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
  };

  const handleUpdateTarget = async () => {
    if (newTarget && !isNaN(newTarget)) {
      setSavingTarget(true);
      try {
        const userId = localStorage.getItem('id');
        await saveMonthlyTarget(userId, newTarget);
        setTargetSpending(newTarget);
        localStorage.setItem('targetSpending', newTarget);
        setNewTarget('');
      } catch (error) {
        console.error('Error saving target:', error);
        alert('Failed to save target. Please try again.');
      } finally {
        setSavingTarget(false);
      }
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-white">{language === 'ar' ? 'الإعدادات' : 'Settings'}</h2>
      
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">{language === 'ar' ? 'إعدادات اللغة' : 'Language Settings'}</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>{language === 'ar' ? 'اختر اللغة' : 'Select Language'}</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="English"
                    name="language"
                    checked={language === 'en'}
                    onChange={() => handleLanguageChange('en')}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="العربية"
                    name="language"
                    checked={language === 'ar'}
                    onChange={() => handleLanguageChange('ar')}
                  />
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">{language === 'ar' ? 'هدف الإنفاق الشهري' : 'Monthly Spending Target'}</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>{language === 'ar' ? 'الهدف الحالي' : 'Current Target'}: ${targetSpending}</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل هدفًا جديدًا' : 'Enter new target'}
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleUpdateTarget}
                    disabled={savingTarget}
                  >
                    {savingTarget ? (language === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (language === 'ar' ? 'تحديث' : 'Update')}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">{language === 'ar' ? 'قيم النقد السريع' : 'Quick Cash Values'}</Card.Header>
            <Card.Body>
              <div className="mb-3">
                {cashValues.map((value) => (
                  <Button
                    key={value}
                    variant="outline-secondary"
                    className="me-2 mb-2"
                    onClick={() => handleRemoveCashValue(value)}
                  >
                    ${value} ✕
                  </Button>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={newCashValue}
                  onChange={(e) => setNewCashValue(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل قيمة جديدة' : 'Enter new value'}
                />
                <Button variant="primary" onClick={handleAddCashValue}>
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">{language === 'ar' ? 'الملاحظات السريعة' : 'Quick Notes'}</Card.Header>
            <Card.Body>
              <div className="mb-3">
                {quickNotes.map((note) => (
                  <Button
                    key={note}
                    variant="outline-primary"
                    className="me-2 mb-2"
                    onClick={() => handleRemoveQuickNote(note)}
                  >
                    {note} ✕
                  </Button>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={newQuickNote}
                  onChange={(e) => setNewQuickNote(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل ملاحظة جديدة' : 'Enter new note'}
                />
                <Button variant="primary" onClick={handleAddQuickNote}>
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings; 
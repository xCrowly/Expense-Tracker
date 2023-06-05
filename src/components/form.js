import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function FormBody() {
    return (

        <div className="form-size bg-light rounded-1">
            <Form>

                <Form.Label >Amount</Form.Label>
                <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control aria-label="Amount (to the nearest dollar)" />
                    <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>

                <label htmlFor="birthday" className="">Date: </label>
                <input type="date" id="birthday" name="birthday" className="m-3"></input>

                <InputGroup>
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Details
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>

                <br />
                <Button variant="primary" type="submit" className="submit-button">
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default FormBody;

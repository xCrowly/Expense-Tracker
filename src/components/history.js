import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import getUserData from "./firebase/getUserData";
import removeUserData from "./firebase/removeUserData";

function History() {
  // gets user data from firebase realtime database
  getUserData(localStorage.getItem("id"));

  // checks if user signed in
  useEffect(() => {
    if (
      localStorage.getItem("email") == null &&
      window.location.pathname === "/history"
    ) {
      window.location.href = "/";
    }
  });

  // ind refers to the current user index
  let ind = 0;

  // this refers to the data entries after sorted by date
  let dataProccessed;

  // get data entries sorted by date
  if (localStorage.getItem("data")) {
    dataProccessed = Object.entries(
      JSON.parse(localStorage.getItem("data"))
    ).sort((a, b) => {
      return (
        parseInt(b[1].date.split("-").join("")) -
        parseInt(a[1].date.split("-").join(""))
      );
    });
  }

  // render data entries sorted and merged by date in months
  function addTableData() {
    let monthlySum = 0;
    let index = ind;
    // get the sum for every month

    if (index < dataProccessed.length) {
      // checks if the last element has only on entries then put it in 1 accordion
      if (index === dataProccessed.length - 1) {
        ind++;
        return (
          <Accordion.Item key={index + 1} eventKey={index + 1}>
            <Accordion.Header>
              {dataProccessed[index][1].date[5] +
                dataProccessed[index][1].date[6] +
                "/" +
                dataProccessed[index][1].date.substr(0, 4)}
            </Accordion.Header>
            <Accordion.Body className="acc-body">
              <Table className="acc-table" striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-success">Amount</th>
                    <th>Note</th>
                    <th>Day</th>
                    <th className="text-danger"></th>
                  </tr>
                </thead>
                <tbody id={dataProccessed[index][1].date}>
                  {dataProccessed.map(
                    // eslint-disable-next-line no-loop-func, array-callback-return
                    (childs) => {
                      if (childs[1].date === dataProccessed[index][1].date) {
                        ind++;
                        return (
                          <tr id={childs[0]} key={childs[0]}>
                            <td>{childs[1].cash}</td>
                            <td>{childs[1].note}</td>
                            <td>{childs[1].date.substr(8)}</td>
                            <td
                              className="acc-btn"
                              onClick={() => {
                                return [
                                  removeUserData(
                                    localStorage.getItem("id"),
                                    childs[0]
                                  ),
                                  setTimeout(() => {
                                    window.location.href = "/history";
                                  }, 1000),
                                ];
                              }}
                            >
                              X
                            </td>
                          </tr>
                        );
                      }
                    }
                  )}
                  {dataProccessed.map(
                    // eslint-disable-next-line no-loop-func, array-callback-return
                    (childs) => {
                      if (childs[1].date === dataProccessed[index][1].date) {
                        monthlySum += parseInt(childs[1].cash);
                      }
                    }
                  )}
                  <tr key={Math.random}>
                    <td className="bg-success text-white">Total</td>
                    <td className="bg-primary text-white">${monthlySum}</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        );
      }

      // checks if there is not multiple entries in the same month
      else if (
        dataProccessed[index][1].date.substr(0, 7) !==
        dataProccessed[index + 1][1].date.substr(0, 7)
      ) {
        ind += 1;
        return [
          <Accordion.Item key={index + 1} eventKey={index + 1}>
            <Accordion.Header>
              {dataProccessed[index][1].date[5] +
                dataProccessed[index][1].date[6] +
                "/" +
                dataProccessed[index][1].date.substr(0, 4)}
            </Accordion.Header>
            <Accordion.Body className="acc-body">
              <Table className="acc-table" striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-success">Amount</th>
                    <th>Note</th>
                    <th>Day</th>
                    <th className="text-danger"></th>
                  </tr>
                </thead>
                <tbody id={dataProccessed[index][1].date}>
                  <tr
                    id={dataProccessed[index][0]}
                    key={dataProccessed[index][0]}
                  >
                    <td>{dataProccessed[index][1].cash}</td>
                    <td>{dataProccessed[index][1].note}</td>
                    <td>{dataProccessed[index][1].date.substr(8)}</td>
                    <td
                      className="acc-btn"
                      onClick={() => {
                        return [
                          removeUserData(
                            localStorage.getItem("id"),
                            dataProccessed[index][0]
                          ),
                          setTimeout(() => {
                            window.location.href = "/history";
                          }, 1000),
                        ];
                      }}
                    >
                      X
                    </td>
                  </tr>
                  {dataProccessed.map(
                    // eslint-disable-next-line no-loop-func, array-callback-return
                    (childs) => {
                      if (childs[1].date === dataProccessed[index][1].date) {
                        monthlySum += parseInt(childs[1].cash);
                      }
                    }
                  )}
                  <tr key={Math.random}>
                    <td className="bg-success text-white">Total</td>
                    <td className="bg-primary text-white">${monthlySum}</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>,
          addTableData(),
        ];
      }

      // checks if there is multiple entries in the same month
      else if (
        dataProccessed[index][1].date.substr(0, 7) ===
        dataProccessed[index + 1][1].date.substr(0, 7)
      ) {
        return [
          <Accordion.Item key={index + 1} eventKey={index + 1}>
            <Accordion.Header>
              {dataProccessed[index][1].date[5] +
                dataProccessed[index][1].date[6] +
                "/" +
                dataProccessed[index][1].date.substr(0, 4)}
            </Accordion.Header>
            <Accordion.Body className="acc-body">
              <Table className="acc-table" striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-success">Amount</th>
                    <th>Note</th>
                    <th>Day</th>
                    <th className="text-danger"></th>
                  </tr>
                </thead>
                <tbody id={dataProccessed[index][1].date}>
                  {dataProccessed.map(
                    // eslint-disable-next-line no-loop-func, array-callback-return
                    (childs) => {
                      if (
                        childs[1].date.substr(0, 7) ===
                        dataProccessed[index][1].date.substr(0, 7)
                      ) {
                        ind++;
                        return (
                          <tr id={childs[0]} key={childs[0]}>
                            <td>{childs[1].cash}</td>
                            <td>{childs[1].note}</td>
                            <td>{childs[1].date.substr(8)}</td>
                            <td
                              className="acc-btn"
                              onClick={() => {
                                return [
                                  removeUserData(
                                    localStorage.getItem("id"),
                                    childs[0]
                                  ),
                                  setTimeout(() => {
                                    window.location.href = "/history";
                                  }, 1000),
                                ];
                              }}
                            >
                              X
                            </td>
                          </tr>
                        );
                      }
                    }
                  )}
                  {dataProccessed.map(
                    // eslint-disable-next-line no-loop-func, array-callback-return
                    (childs) => {
                      if (
                        childs[1].date.substr(0, 7) ===
                        dataProccessed[index][1].date.substr(0, 7)
                      ) {
                        monthlySum += parseInt(childs[1].cash);
                      }
                    }
                  )}
                  <tr key={Math.random}>
                    <td className="bg-success text-white">Total</td>
                    <td className="bg-primary text-white">${monthlySum}</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>,
          addTableData(),
        ];
      }
    }
  }

  return (
    <div className="history-size rounded-1">
      <Accordion id="acc-body1">
        {/* checks if there is data or not in order to run the function */}
        {dataProccessed ? addTableData() : ""}
      </Accordion>
    </div>
  );
}

export default History;

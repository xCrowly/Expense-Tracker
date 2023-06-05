import React from "react";
import Table from 'react-bootstrap/Table';

function History() {

    return (
        <div className="history-size rounded-1">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-success">Amount</th>
                        <th>Details</th>
                        <th>Date</th>
                        <th className="text-danger">X</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>105.50</td>
                        <td>Buying piano</td>
                        <td>05/05/2024</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td colSpan={2}>Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )

}

export default History;
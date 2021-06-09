import React from "react";
import './App.css';
import { Container, Form, Row, Button } from 'react-bootstrap';
import Token from './Token';


// React components must start with a uppercase letter
export default class QueryComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_token_list: []
        };
    }

    tokenize(sql) {
        // add parentheses to keep delimiters in the resulting array of split
        const re = /(SELECT|WHERE|FROM|IN|BWTWEEN|AND|ORDER BY|ASC|DESC|HAVING|LIKE|GROUP BY|COUNT|MAX|MIN)/g
        var token_list = sql.split(re);
        token_list = token_list.filter((element) => {
            return element != "" && element != " "
        });
        return token_list;
    }

    callBackAddToken(value) {
        var current_selected = this.state['selected_token_list'];
        current_selected.push(value);
        this.setState({ "current_selected": this.state['selected_token_list'] });
    }

    callBackRemoveToken(value) {
        var current_selected = this.state['selected_token_list'];
        var index = current_selected.indexOf(value);
        if (index != -1) {
            current_selected.splice(index, 1);
        }

        this.setState({ "selected_token_list": current_selected });
    }

    render() {
        const token_list = this.tokenize(this.props.sql_query);

        return (
            <Container>
                <h3 className="Hyp-label">Hypothesis {this.props.index}</h3>
                <Row className="NL-query"><strong>Natural language query:</strong>{" "}<strong style={{ "color": "green" }}> &nbsp; {this.props.nl_query}</strong></Row>
                <Row className="Table-information"><strong>Table information</strong>: XXX</Row>
                <Row className="GT-query"><strong>Ground truth query:</strong> &nbsp; {this.props.gt_query} </Row>
                <Row className="SQL-query-label">
                    <strong>The corresponding SQL query is as below. Please select the parts that look incorrect to you: </strong>
                </Row>
                <Row className="SQL-query">
                    {
                        token_list.map((token, index) => {
                            return (
                                <Token tokenName={token} type='keyword' addToken={() => this.callBackAddToken(token)} removeToken={() => this.callBackRemoveToken(token)} />
                            );
                        })
                    }
                </Row>
                <Row className="Problem-part">
                    {/* conditionally rendering the "Problematic Parts" string  */}
                    {
                        this.state['selected_token_list'].length > 0 &&
                        <div style={{ "marginRight": '10px' }}><strong>Problematic parts: </strong></div>
                    }

                    {
                        this.state['selected_token_list'].map((value, index) => {
                            return <Button class="token" disabled="true" variant="danger" style={{ 'marginRight': '5px' }}>{value}</Button>;
                        })
                    }
                </Row>
                <Row className="Question">
                    <h4>Please answer the following questions:</h4>
                    <Form>
                        <Form.Group controlId="open_ended_error_description">
                            <Form.Label>Please describe what error(s) exist in the SQL query given the natural language query? You can explain in terms of the problematic parts selected:</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Please describe the error(s)" />
                        </Form.Group>
                    </Form>
                </Row>
            </Container>
        );
    }
}
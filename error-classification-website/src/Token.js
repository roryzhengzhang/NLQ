import React from 'react';
import { Container, Form, Row, Button } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Token extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };

        this.switchState = this.switchState.bind(this);
    }

    switchState() {
        var current_state = this.state['selected'];
        if (current_state) {
            this.props.removeToken();
        }
        else {
            this.props.addToken();
        }
        this.setState({ "selected": !current_state });
    }

    render() {
        const default_color_map = {
            keyword: "outline-primary",
            aggregation: "outline-warning",
            table: "outline-success",
            column: "outline-info"
        };

        const selected_color_map = {
            keyword: "primary",
            aggregation: "warning",
            table: "success",
            column: "info"
        };

        return (
            <div>
                <Button className="token" variant={this.state['selected'] ? selected_color_map[this.props.type] : default_color_map[this.props.type]} style={{ 'marginRight': '5px' }} onClick={this.switchState}>{this.props.tokenName}</Button>
            </div>
        );
    }
}
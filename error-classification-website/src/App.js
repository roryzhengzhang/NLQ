import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Container, Form, Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BasicTable from './Table';
import ButtonAppBar from './NavBar';
import Token from './Token';
import QueryComponent from './queryComponent';
import Divider from '@material-ui/core/Divider';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected_token_list: []
    };
    //We have to declare the query_data in the constructor, otherwise the compiler will treat query_data as undefined in the rendering phase 
    this.state = {
      query_data: null
    }

    // this.callBackAddToken = this.callBackAddToken(this);
    // this.callBackRemoveToken = this.callBackRemoveToken(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch("http://interplaylab.xyz:5000/get_next").then(response => {

      if (response.status >= 200 && response.status < 300) {
        console.log("Sucessfully load the query data");
      }
      else {
        console.log("Fail to load the query data");
      }

      return response.json();
    }).then(data => {
      console.log("get the query data: " + data);
      this.setState({ query_data: data });
    })
  }


  handleClick() {

    console.log("onClickAction");
    fetch("http://interplaylab.xyz:5000/get_next").then(response => {

      if (response.status >= 200 && response.status < 300) {
        console.log("Sucessfully load the query data");
      }
      else {
        console.log("Fail to load the query data");
      }

      return response.json();
    }).then(data => {
      console.log("get the query data: " + data);
      this.setState({ query_data: data });
    })
    //move the screen to the top
    window.scrollTo(0, 0);
  }

  // Return the tokenized SQL query
  tokenize() {
    return {
      token_list: [{
        value: "SELECT",
        type: "keyword"
      },
      {
        value: "COUNT",
        type: "aggregation"
      },
      {
        value: "col2",
        type: "column"
      },
      {
        value: "FROM",
        type: "keyword"
      },
      {
        value: "TABLE",
        type: "table"
      },
      {
        value: "WHERE",
        type: "keyword"
      },
      {
        value: "col0 = terrence ross",
        type: "column"
      },
      ]
    }
  }

  render() {



    var sql_tokens = this.tokenize();

    // Only rendering when the query_data is retrieved from the backend
    if (!this.state.query_data) {
      return null;
    }

    var hyp_index = 0;

    return (
      <div>
        <ButtonAppBar cur_index={this.state.query_data['cur_index']} total_len={this.state.query_data['total_len']} />
        <Container style={{ "textAlign": 'left' }}>
          <Row id="Description">
            <h5 style={{ "margin": "auto" }}><strong>Task description</strong></h5>
            <div style={{ "margin": "auto" }}>You will see multiple SQL queries automatically generated given a same natural language query. However, each of them may contain some errors. For each SQL query, please select the incorrect parts and briefly describe the errors that the SQL query has made.</div>
          </Row>
          <Row>
            <Col md={8}>
              {this.state.query_data['predictions'].map((pred, index) => {
                //Only return the false SQL hypotheses
                if (pred['hyp_correct'] == 'False') {
                  hyp_index += 1;
                  return (
                    <div>
                      <QueryComponent className="QueryComponent" index={hyp_index} nl_query={this.state.query_data['NL-query']} gt_query={this.state.query_data['GT']} sql_query={pred['SQL']} />
                    </div>
                  );
                }
                else {
                  return;
                }

              })}
            </Col>
            <Col md={8}>
              <BasicTable />
            </Col>
          </Row>


          <div id="submit-button">
            <Button variant="primary" onClick={this.handleClick}>Next</Button>
          </div>
        </Container>
      </div>
    );
  }

}
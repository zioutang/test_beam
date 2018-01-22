import {
  Card,
  CardTitle,
}
from 'material-ui/Card';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import AppBar from 'material-ui/AppBar';
import {
  GridList,
  GridTile
} from 'material-ui/GridList';
import TextField from 'material-ui/TextField';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import validator from 'validator';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      sendError: null,
      in: [],
      out: [],
      DrawerOpen: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.send = this.send.bind(this);
    this.loadData = this.loadData.bind(this);
  }


  componentDidMount() {
    this.loadData();
  }


  loadData() {
    fetch('http://localhost:3000/data', {
        credentials: 'include',
      })
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.success) {
          let sum = 0;
          resp.userData.out.forEach(item => {
            sum += parseInt(item.amount);
          })
          this.setState({
            balance: resp.userData.balance - sum,
            in: resp.userData.in,
            out: resp.userData.out,
          });
        } else {
          console.log(resp.error.message);
        }
      })
      .catch((err) => {
        throw err;
      });
  }
  handleToggle() {
    // console.log(this.state);
    this.setState({
      DrawerOpen: !this.state.DrawerOpen,
    });
  }
  send(recipient, amount) {
    // console.log(amount);
    if (!recipient || !amount) {
      this.setState({
        sendError: 'recipient or Amount cannot be empty'
      });
      return;
    }
    if (!validator.isEmail(recipient)) {
      this.setState({
        sendError: 'The recipient is not an email'
      });
      return;
    }
    if (parseInt(amount) > this.state.balance) {
      this.setState({
        sendError: 'Your Balance is not enough'
      });
      return;
    } else {
      this.setState({
        sendError: null
      });
      this.handleToggle();
      fetch('http://localhost:3000/send', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient,
            amount,
          }),
        })
        .then(resp => (resp.status === 401 ? resp.text() : resp.json()))
        .then((result) => {
          console.log(result);
          this.loadData();
        })
        .catch((err) => {
          throw err;
        });
    }
  }


  render() {
    let recipient;
    let amount;

    return (
      <div>
        <AppBar
          className="appbar"
          titleStyle={{ textAlign: 'center' }}
          title="Your Profile"
          showMenuIconButton={false}
        />
        <Drawer
          openSecondary={true}
          docked={false}
          width={'30%'}
          open={this.state.DrawerOpen}
          onRequestChange={(open) => this.setState({open})}
          disableSwipeToOpen={true}
        >
          <div>
          <FlatButton
            label="Back"
            onClick={this.handleToggle}
            icon={(<i className="material-icons">keyboard_arrow_left</i>)}
            primary={true}
          />
        </div>
        <div className="centered">
          <p className="help is-danger">{this.state.sendError}</p>
        </div>
          <input
            className="input"
            ref={(node) => { recipient = node; }}
            placeholder="Email"
          />
          <input
            className="input"
            ref={(node) => { amount = node; }}
            placeholder="Amount"
          />
          <FlatButton
            label="Send"
            onClick={()=>{
              this.send(recipient.value, amount.value);
            }}
            primary={true}
          />

        </Drawer>
        <h>Current Balance: {this.state.balance}</h>
        <FlatButton
          label="Send Money"
          onClick={this.handleToggle}
          primary={true}
          disableTouchRipple={true}
        />
        <Paper zDepth={2} style={{ display: 'flex' }}>
          <Table>
            <TableHeader
              adjustForCheckbox={false}
              displaySelectAll={false}
              >
          <TableRow>
            <TableHeaderColumn>Recipient Email</TableHeaderColumn>
            <TableHeaderColumn >Amount</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}>
          {this.state.out.map((item, key) =>{
            return  (<TableRow id={key}>
            <TableRowColumn>{item.email}</TableRowColumn>
            <TableRowColumn style={{color: 'red'}}>{item.amount}</TableRowColumn>
          </TableRow>)
          })}
        </TableBody>
          </Table>

        </Paper>
      </div>
    );
  }
}


module.exports = {
  Board,
};

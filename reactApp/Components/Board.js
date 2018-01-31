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
import React from 'react';
import Drawer from 'material-ui/Drawer';
import validator from 'validator';

const styles = {
  center: {
    'textAlign': 'center',
    // border: '2px solid red',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  table: {
    // border: '2px solid red',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'baseline',
  }
};
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
      this.createTable = this.createTable.bind(this);
    }


    componentDidMount() {
      this.loadData();
    }


    loadData() {
      fetch('https://beam-test-123.herokuapp.com/data', {
          credentials: 'include',
        })
        .then(resp => resp.json())
        .then((resp) => {
          if (resp.success) {
            let sum_out = 0;
            let sum_in = 0;
            console.log('out: ', resp.userData.out);
            console.log('in: ', resp.userData.in);

            resp.userData.out.forEach(item => {
              sum_out += parseInt(item.amount);
            })
            resp.userData.in.forEach(item => {
              sum_in += parseInt(item.amount);
            })
            this.setState({
              balance: resp.userData.balance - sum_out + sum_in,
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
      this.setState({
        DrawerOpen: !this.state.DrawerOpen,
      });
    }
    send(recipient, amount) {
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
        fetch('https://beam-test-123.herokuapp.com/send', {
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
    createTable({
      list,
      style,
      title
    }) {
      return (
        <div>
        <p style={styles.center}>{title}</p>
      <Table
        style={{ tableLayout: 'auto' }}
        fixedHeader={false}
        >
      <TableHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        >
        <TableRow>
          <TableHeaderColumn>Email</TableHeaderColumn>
          <TableHeaderColumn >Amount</TableHeaderColumn>
        </TableRow>
      </TableHeader>
        <TableBody
          displayRowCheckbox={false}>
          {list.map((item, key) =>{
            return  (<TableRow id={key}>
            <TableRowColumn>{item.email}</TableRowColumn>
            <TableRowColumn style={{color: style}}>{item.amount}</TableRowColumn>
          </TableRow>)
          })}
        </TableBody>
    </Table>
  </div>
      )
    }

    render() {
        let recipient;
        let amount;

        return (
            <div>
        <AppBar
          titleStyle={{ textAlign: 'center' }}
          title="Your Transaction History"
          iconElementLeft={
            <FlatButton
              label="Login out"
              onClick={() => this.props.history.push('/')}
              disableTouchRipple={true}
            />}
          iconElementRight={
            <FlatButton
            label="Send Money"
            onClick={this.handleToggle}
            disableTouchRipple={true}
          />}
        />
        <Drawer
          docked={false}
          openSecondary={true}
          width={'30%'}
          open={this.state.DrawerOpen}
          onRequestChange={(DrawerOpen) => this.setState({DrawerOpen})}
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
        <br />
        <div style={styles.table}>
          <h style={styles.center}> Current Balance: {this.state.balance}</h>
        </div>
        <br />
        <br />
        <Paper zDepth={2} style={styles.table}>

          {/* <div style={styles.table}> */}
            {this.createTable({list: this.state.in, style: 'green', title: 'Money you received'})}
            {this.createTable({list: this.state.out, style: 'red', title: 'Money you sent'})}
          {/* </div> */}

        </Paper>

      <
      /div>
    );
  }
}


module.exports = {
  Board,
};

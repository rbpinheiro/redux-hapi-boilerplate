import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

const Main = React.createClass({
  render: function () {
    const {
      increment,
      incrementIfOdd,
      incrementAsync,
      decrement,
      counter
    } = this.props;

    return (
      <Counter
        increment      = { increment }
        incrementIfOdd = { incrementIfOdd }
        incrementAsync = { incrementAsync }
        decrement      = { decrement }
        counter        = { counter }
      />
    );
  }
});

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
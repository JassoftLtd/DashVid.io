import React, {Component} from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

const style = {
    card: {
        margin: 12,
        float: 'left',
    }
};

export default class AddCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            number: "",
            expiration: "",
            cvc: "",
            nameError: null,
            numberError: null,
            expirationError: null,
            cvcError: null,
        };
    }

    handleAddCard (e) {

        e.preventDefault();

        this.setState({
            nameError: null,
            numberError: null,
            expirationError: null,
            cvcError: null,
        });

        if(this.state.name.length === 0) {
            this.setState({
                nameError: "Please enter the name on the card"
            });
            return
        }

        if(this.state.number.length !== 16) {
            this.setState({
                numberError: "Please enter your card number"
            });
            return
        }

        if(this.state.expiration.length === 0) {
            this.setState({
                expirationError: "Please enter your cards expiration date"
            });
            return
        }

        if(this.state.expiration.length === 0) {
            this.setState({
                expirationError: "Please enter your cards expiration date"
            });
            return
        }

        if(!/(0[1-9]|1[0-2])\/[0-9]{2}/.test(this.state.expiration)) {
            this.setState({
                expirationError: "Please enter your cards expiration date in the specified format MM/YY"
            });
            return
        }

        if(this.state.cvc.length !== 3) {
            this.setState({
                cvcError: "Please enter the 3 digits on the back of your card"
            });
            return
        }

        let exp_parts = this.state.expiration.split('/');

        let exp_month = exp_parts[0];
        let exp_year = exp_parts[1];

        this.props.addCard(this.state.name, this.state.number, exp_month, exp_year, this.state.cvc)
    }

    handleChangeName (e) {
        this.setState({
            nameError: null,
        });
        this.setState({name: e.target.value});
    }

    handleChangeNumber (e) {
        this.setState({
            numberError: null,
        });
        this.setState({number: e.target.value});
    }

    handleChangeExpiration (e) {
        this.setState({
            expirationError: null,
        });
        this.setState({expiration: e.target.value});
    }

    handleChangeCVC (e) {
        this.setState({
            cvcError: null,
        });
        this.setState({cvc: e.target.value});
    }

    render() {
        const {message} = this.props;

        return (
            <Card style={style.card}>
                <CardTitle title="Add Card" subtitle={message} data-qa="addCard-form-message" />
                <form onSubmit={this.handleAddCard.bind(this)}>
                    <CardText>
                        <TextField
                            id="name"
                            hintText="Name on card"
                            type="text"
                            errorText={this.state.nameError}
                            value={this.state.name}
                            onChange={this.handleChangeName.bind(this)}
                            data-qa="addCard-field-name"
                        />
                        <br />
                        <TextField
                            id="number"
                            hintText="Card number"
                            type="tel"
                            errorText={this.state.numberError}
                            value={this.state.number}
                            onChange={this.handleChangeNumber.bind(this)}
                            data-qa="addCard-field-number"
                        />
                        <br />
                        <TextField
                            id="expiration"
                            hintText="MM/YY"
                            type="tel"
                            errorText={this.state.expirationError}
                            value={this.state.expiration}
                            onChange={this.handleChangeExpiration.bind(this)}
                            data-qa="addCard-field-expiration"
                        />
                        <br />
                        <TextField
                            id="cvc"
                            hintText="CVC"
                            type="tel"
                            errorText={this.state.cvcError}
                            value={this.state.cvc}
                            onChange={this.handleChangeCVC.bind(this)}
                            data-qa="addCard-field-cvc"
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton type="submit" label="Add Card" primary={true}
                                      data-qa="addCard-btn-add" />
                    </CardActions>
                </form>
            </Card>
        );
    }
}

AddCard.propTypes = {
    message: PropTypes.string,
    addCard: PropTypes.func.isRequired
}
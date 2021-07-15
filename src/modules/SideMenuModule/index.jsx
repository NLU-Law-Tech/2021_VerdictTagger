import React, { Component } from 'react'
import BankAccount from './bankAccount'
import Defendant from './defendant'
import TagInfo from './tagInfo'

export class index extends Component {
    render() {
        return (
            <>
                <Defendant/>
                <br />
                <BankAccount/>
                <br />
                <TagInfo/>
            </>
        )
    }
}

export default index

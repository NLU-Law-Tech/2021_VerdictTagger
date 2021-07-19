import React, { Component } from 'react'
import BankAccount from './bankAccount'
import Defendant from './defendant'
import PhoneNumber from './phoneNumber'
import TagInfo from './tagInfo'
import  TagInfoBank  from './tagInfoBank'
import  TagInfoPhone  from './tagInfoPhone'

export class index extends Component {
    render() {
        return (
            <>
                <Defendant/>
                <br />
                <TagInfo/>
                <br />
                <BankAccount/>
                <br/>
                <TagInfoBank/>
                <br />
                <PhoneNumber/>
                <br/>
                <TagInfoPhone/>
               
            </>
        )
    }
}

export default index

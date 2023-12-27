import React, { useState, ChangeEvent, FormEvent } from 'react';
import ContentWrapper from '../ContentWrapper';
import { MainActionButton } from '../../Components/ActionButtons/ActionButtons';
import './RegisterView.css'





export default function RegisterView()
{

    return <ContentWrapper>
    <form action="" method="post">
        <table className="registerTable">
        <tr>
            <td colSpan={2}>
                <h1>Rejestracja</h1>
            </td>
        </tr>
        <tr>
            <td>Login</td>
            <td>
            <input type="text" name="login"></input>
            </td>
        </tr>
        <tr>
            <td>Imię</td>
            <td>
            <input type="text" name="name"></input>
            </td>
        </tr>
        <tr>
            <td>Nazwisko</td>
            <td>
            <input type="text" name="surname"></input>
            </td>
        </tr>
        <tr>
            <td>Email</td>
            <td>
            <input type="text" name="email"></input>
            </td>
        </tr>
        <tr>
            <td>Hasło</td>
            <td>
                <input type="password" name="password"></input>
            </td>
        </tr>
        <tr>
            <td>Powtórz hasło</td>
            <td>
                <input type="password" name="repeatedpassword"></input>
            </td>
        </tr>
        <tr>
            <td colSpan={2}><MainActionButton text="Zarejestruj się"></MainActionButton></td>
        </tr>
        </table>
    </form>
    </ContentWrapper>;
}
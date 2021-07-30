import React, { createContext, useReducer } from "react";
import cafeApi from "../api/cafeApi";
import { loginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";

type AuthContextProps ={
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    singUp: (RegisterData: RegisterData) => void;
    signIn: (loginData: loginData) => void;
    logOut: () => void;
    removeError: () => void;
}


const authInicialState: AuthState = {
    status:'checking',
    token: null,
    user: null,
    errorMessage:''
}

export const AuthContext = createContext({} as AuthContextProps );



export const AuthProvider = ({ children }: any) => {

    const [ state, dispatch] = useReducer(authReducer, authInicialState );

    useEffect(() => {
        checkToken();
    }, []);
    
    const checkToken = async () => {

        const token = await AsyncStorage.getItem('token');
        //No toke, no autenticado
        if (!token ) return dispatch({ type:'notAuthtenticated' })

        // hay token
        const resp = await cafeApi.get('/auth')
        if (resp.status !== 200 ) {
            return dispatch({ type: 'notAuthtenticated' })
        }
        dispatch({
            type: 'singUp',
            payload:{
                token: resp.data.token,
                user: resp.data.usuario
            }
        });
    } 

    
    const signIn = async({ correo, password }: loginData) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password })
            dispatch({
                type: 'singUp',
                payload:{
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error.response.data);
            dispatch({ 
                type: 'addError', 
                payload:error.response.data.msg || 'Información Incorrecta'
            })
            
        }
    };
    0


    const singUp = async({nombre, correo, password}: RegisterData ) => {
        try {
            const { data } = await cafeApi.post<LoginResponse>('/usuarios', { correo, password, nombre })
            dispatch({
                type: 'singUp',
                payload:{
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error.response.data);
            dispatch({ 
                type: 'addError', 
                payload:error.response.data.errors[0].msg || 'El correo ya esta registrado'
            })
            
        }
    };
    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        dispatch({type:'logout' })
    };
    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return(
        <AuthContext.Provider value={{
            ...state,
            singUp,
            signIn,
            logOut,
            removeError,

        }}>
            { children }
        </AuthContext.Provider>
    )
}

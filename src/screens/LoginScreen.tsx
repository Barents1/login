import React, { useContext, useEffect } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/theme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { Alert } from 'react-native';


interface Props extends StackScreenProps<any, any>{}


export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext)

    const { email, password, onChange} = useForm({
        email: '',
        password:'',
    });

    const onLongin = () => {
        console.log({email, password});
        Keyboard.dismiss();
        signIn({ correo: email, password });
        
    }

    useEffect(() => {
           if (errorMessage.length === 0) return;
           Alert.alert('Login Incorrecto', errorMessage,
           [
               {
                   text: 'Ok',
                   onPress: removeError
               }
           ] )
    }, [ errorMessage ])

    return (  
        <>
            {/*  Background  */}
            <Background />
            <KeyboardAvoidingView
            style={{ flex:1 }}
            behavior= { (Platform.OS === 'ios') ? 'padding': 'height'}
            >
                <View style={ loginStyles.fromContainer}>

                    {/*  Keyboard void view  */}
                    <WhiteLogo />

                    <Text style={ loginStyles.title }>Login</Text>
                    <Text style={ loginStyles.label }>Email: </Text>
                    <TextInput 
                        placeholder="Ingrese su email"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={ [
                            loginStyles.inputField,
                            (Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ] }
                        selectionColor="white"

                        onChangeText={ (value) => onChange(value, 'email')}
                        value={email}

                        autoCapitalize="none"
                        autoCorrect={ false }

                    />
                    <Text style={ loginStyles.label }>Contraseña:</Text>
                    <TextInput 
                        placeholder="********"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry

                        style={ [
                            loginStyles.inputField,
                            (Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ] }
                        selectionColor="white"

                        onChangeText={ (value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={ onLongin }
                        

                        autoCapitalize="none"
                        autoCorrect={ false }

                    />
                    {/*  Boton de login */}
                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button }
                            onPress={onLongin}
                        >
                            <Text style={ loginStyles.buttonText }>Login</Text>
                        </TouchableOpacity>
                    </View>

                        {/*  crear una cuenta */}
                    <View style={ loginStyles.newUserContainer }>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={ () => navigation.replace('registerScreen') }
                        >
                            <Text style={ loginStyles.buttonText }>Nueva Cuenta </Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </KeyboardAvoidingView>
        
        </>
    )
}

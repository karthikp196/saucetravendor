import React , {Component} from 'react';
import {Text , View , StatusBar, Alert  } from 'react-native';
import { TextInput , Button , Title , Headline , Snackbar } from 'react-native-paper';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPTextView from 'react-native-otp-textinput';





class Otpscreen extends Component {

  state = {mobile:'', token:'' ,loading:false}

    
    render(){
      const getData = async () => {
        this.setState({loading:true })
        try {
          const value = await AsyncStorage.getItem('mobile')
          const firebasetoken = await AsyncStorage.getItem('firebase')
          var phone = value
          var token = this.state.token;
          var firebase_token = firebasetoken;
          var dataObj = {}
          dataObj.mobile = phone,
          dataObj.otp = token,
          dataObj.firebase_token = firebase_token

                 
        fetch('https://foody-database.herokuapp.com/api/vendorVerify',{
          method: 'POST',
          header:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataObj)
          })
          .then((response) => response.json())
          .then((res) => {
              
              if (res.is_error == 0)
              {
                var restoken = res.rest_token;
                storeToken(restoken);
                this.props.navigation.navigate('Home');
                this.setState({loading:false })
              }
              else
              {
                  // this.setState({visible:true})
                  //alert("Invalid Credentials")
                  alert(res.msg)
                  this.setState({loading:false })
              }
          })
          .catch(function(error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
              throw error;
            });
          

        } catch(e) {
          // error reading value
        }
      }

      const storeToken = async (restoken) => 
      {
        try 
          {
             await AsyncStorage.setItem("restoken", restoken);
             
          } 
          catch (error) 
          {
            console.log("Something went wrong", error);
          }
      }


      

        const clicked = () =>
        {
            this.props.navigation.navigate('Home');
        }
        return(
            <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle="dark-content" ></StatusBar>   
            <Text style={styles.instructions}>Enter Your OTP</Text>

            <OTPTextView
              handleTextChange={(e) => {}}
              containerStyle={styles.textInputContainer}
              textInputStyle={styles.roundedTextInput}
              tintColor="#3F51B5"
              inputCount="5"
              handleTextChange={(text) => this.setState({token: text})}
            />

            <View>
            <Button style={styles.buttons} mode="contained" loading={this.state.loading}  onPress={ getData }>Submit</Button>
            </View>
          
          </View>
        )
    }

}

const styles = 
{
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 5,
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      instructions: {
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 20,
      },
      textInputContainer: {
        marginBottom: 20,
      },
      roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
      },
      buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '60%',
      },
      textInput: {
        height: 40,
        width: '80%',
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        letterSpacing: 5,
        marginBottom: 10,
        textAlign: 'center',
      },
      buttonStyle: {
        marginHorizontal: 20,
      },
}

export default Otpscreen;
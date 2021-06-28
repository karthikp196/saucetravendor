import React , {Component} from 'react';
import {Text , View , StatusBar,ActivityIndicator  } from 'react-native';
import { TextInput , Button , Title , Headline , Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'


class Login extends Component {

  
    
    state = {mobile:'' , visible:false,loading:false};

    render(){
      
        const login = () => {
            var mobile = this.state.mobile;
            var dataObj = {}
            dataObj.mobile = mobile,
            this.setState({loading:true })
           
            fetch('https://foody-database.herokuapp.com/api/vendorAuth',{
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
                      // var vendor_id = res.id;
                      storeToken(mobile);
                      this.props.navigation.navigate('Otpscreen');
                      this.setState({loading:false })
                      alert(res.msg)
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
    
            
          }
    
    
          const storeToken = async (mobile) => 
          {
            try 
              {
                 await AsyncStorage.setItem("mobile", mobile);
              } 
              catch (error) 
              {
                console.log("Something went wrong", error);
              }
          }
    
          const getData = async () => {
            try {
              const value = await AsyncStorage.getItem('mobile')
              alert(value)
            } catch(e) {
              // error reading value
            }
          }
    
          const onDismissSnackBar = () =>
          {
            this.setState({visible:false})
          }
    
         
    
        
        return(
            <View style={styles.container}>
            <StatusBar backgroundColor={'#040468'} barStyle="light-content" ></StatusBar>   

            <View style={styles.topview}>
              <Headline style={styles.headers}>Welcome to Saucetra</Headline>
              <Title style={styles.title}>Sign in to continue !</Title>
            </View>

            <View style={styles.formview}>
              <TextInput keyboardType={'numeric'} style={styles.inputs} label="MObile No" onChangeText={(value) => this.setState({mobile: value})}  mode="outlined" />
              <Button style={styles.buttons} mode="contained" loading={this.state.loading} onPress={login } >Login</Button>
            </View>

            

            <Snackbar
              visible={this.state.visible}
              onDismiss={onDismissSnackBar}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({visible:false})
                },
              }}
            >
              Invalid Credentials , Please try again
            </Snackbar>

            {/* <Button  mode="contained" onPress={() => this.props.navigation.navigate('Home') }>Orders</Button> */}

              <View style={styles.footerview}>
                <Text style={styles.footertext}>Terms & Conditions</Text>
              </View>
              
          </View>
        )

    }

}


const styles = 
{
    container:{
        flex:1,
        backgroundColor: '#040468',
    },
    topview:{
      flex:2,
      paddingTop:40,
      backgroundColor:'#040468',
      padding:10

    },
    formview:{
      flex:5,
      backgroundColor:'#FFF',
      padding:10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop:50
    },
    footerview:{
      backgroundColor:'#FFF',
      paddingBottom:20
    },
    footertext:{
      fontFamily: 'Nunito-Regular',
      textAlign:'center',
      letterSpacing:2
    },
    inputs:{
      marginTop:10,
      height:50
    },
    buttons:{
      padding:5,
      marginTop:10,
      fontFamily: 'Nunito-Regular',
      backgroundColor:'#040468'
    },
    footer: {
        flex: 1,
    },
    textstyles:{
      textAlign:'center',
    },
    headers:{
      color:'#FFF',
      fontSize:30,
      fontFamily: 'Nunito-Regular',
      letterSpacing:1
    },
    title:{
      color:'#FFF',
      fontFamily: 'Nunito-Regular',
      letterSpacing:1
    }


};


export default Login;

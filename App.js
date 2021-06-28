import * as React from 'react';
import {Text , View} from 'react-native';
import Route from './Route.js';



export default function App() {

const [visible, setVisible] = React.useState(false);
const onToggleSnackBar = () => setVisible(!visible);
const onDismissSnackBar = () => setVisible(false);


  return (
    <Route />
  );
}

const styles = 
{
    container:{
        flex:1,
        backgroundColor: '#FFF',
        paddingLeft:10,
        paddingRight:10
    },
    topview:{
      flex:2,
      paddingTop:40
    },
    formview:{
      flex:5,
    },
    inputs:{
      marginTop:10
    },
    buttons:{
      padding:10,
      marginTop:10
    },
    footer: {
        flex: 1,
    },
    textstyles:{
      textAlign:'center',
    },
    headers:{
      color:'#131DF2',
      fontSize:30
    }

};
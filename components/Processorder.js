import React , {Component} from 'react';
import {Text , View  , ScrollView, StatusBar, FlatList,RefreshControl,TouchableOpacity,Linking, Platform, PermissionsAndroid, Alert} from 'react-native';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { Title , Divider , Button,TextInput, Paragraph , Headline , RadioButton,ActivityIndicator ,Portal,Modal,Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
import { connect } from 'react-redux'
import openMap from 'react-native-open-maps';
import Geolocation from '@react-native-community/geolocation';

export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Saucetra is trying to access your location...',
        'message': 'Please switch on your GPS in the settings ',
        'buttonPositive': 'OK',

      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Please turn on the GPS in settings")
    } else {
      console.log("location permission denied")
      
    }
  } catch (err) {
    console.warn(err)
  }
}
  
  

class Processorder extends Component {
    state = {business:[] , label:'',v_lat:'', v_long:'', u_lat:'',u_long:'', neighbourhood:'', food:[] ,foodprice:'',reason:'',modalvisible:false,modalhide:false,disablevalue:false ,error:'1', order_id:'' ,special_instructions:'',status_order:'', loading:false ,pageloading:false, user_id:'' ,user_name:'',totalprice:'',mobile:'',day:'', name:'' , price:'' , quantity:'' , total:'',created_at:'',order_status:'',address:'',landmark:'',pincode:''}


    async componentDidMount()
    {
        this.setState({order_token:this.props.route.params.order_id})
        this.business_info()
        this.setState({processed:this.props.route.params.processed})
        this.food_items();
        await requestLocationPermission()   

        Geolocation.getCurrentPosition(
            (pos) => {
              this.setState({v_lat:pos.coords.latitude}) 
              this.setState({v_long:pos.coords.longitude})
              console.log(this.state.v_long)
              console.log(this.state.v_lat)
        })

      

    }

    

    async business_info() 
    {
        fetch('https://foody-database.herokuapp.com/api/order-details',{
        method: 'POST',
        header:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"order_id":this.props.route.params.order_id})
        })
        .then((response) => response.json())
        .then((res) => {

            //alert(res.results[0].email)
            console.log(res)
            this.setState({user_id:res[0].user_id ,special_instructions:res[0].special_instructions, address:res[0].address,landmark:res[0].landmark,pincode:res[0].pincode, user_name: res[0].name , totalprice: res[0].price  ,mobile:res[0].mobile,day:res[0].date, loading:false , quantity:res[0].quantity, total:res[0].total, created_at:res[0].created_at,order_status:res[0].status })
            // //alert(this.state.orders[0].title)
            // // alert(res[1].order_token)  
            
        })
        .catch(function(error) {
        alert('There has been a problem with your fetch operation: ' + error.message);
        console('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
            throw error;
        });
    }

    async food_items() 
    {
        fetch('https://foody-database.herokuapp.com/api/order-eats',{
        method: 'POST',
        header:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"order_id":this.props.route.params.order_id})
        })
        .then((response) => response.json())
        .then((res) => {
            
            this.setState({food:res , loading:false })
            this.setState({error:'0' })
            this.setState({foodprice:this.state.food[0]['price']})
            console.log(this.state.foodprice)
            // //alert(this.state.orders[0].title)
            // // alert(res[1].order_token)   
        })
        .catch(function(error) {
        alert('There has been a problem with your fetch operation: ' + error.message);
        console('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
            throw error;
        });
    }




    render(){



        const onRefresh = () =>
        {
            this.setState({order_token:this.props.route.params.order_id})
            this.business_info()
            this.setState({processed:this.props.route.params.processed})
            this.food_items();
            console.log('refreshed')
        }
        

      

        const getLocation = () => {
        
            alert("hey")
          }

          const getuser = () => {
        
                const url = 'https://maps.google.com?saddr=Current+Location&daddr='+this.state.address+','+this.state.landmark+''
                
                Linking.openURL(url);
           
          }


        const status1 = "Confirmed & Processing";
        const status2 = "Packed & Out for Delivery";
        const status3 = "Delivered";
        const status4 = "Order Cancelled";

       
      

        const updateorder = (status) => {
            if(status == "Order Cancelled")
            {
                var cancelreason = this.state.reason;
                if (cancelreason == "")
                {
                    alert("Please Enter reason for cancellation");
                }
                else
                {
                    var order_id = this.props.route.params.order_id;
                    this.setState({loading:true });
                    this.setState({disablevalue:true })
                    var dataObj = {}
                    dataObj.order_id = order_id,
                    dataObj.status = status,
        
                    fetch('https://foody-database.herokuapp.com/api/modify-status',{
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
                        //   alert(res.msg)
                          this.setState({loading:false })
                          this.setState({status_order: status})
                          onRefresh() 
                          this.setState({disablevalue:false })
                          this.setState({modalvisible:false})
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
            }
            else {

                var order_id = this.props.route.params.order_id;
                this.setState({loading:true });
                this.setState({disablevalue:true })
                var dataObj = {}
                dataObj.order_id = order_id,
                dataObj.status = status,
    
                fetch('https://foody-database.herokuapp.com/api/modify-status',{
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
                    //   alert(res.msg)
                      this.setState({loading:false })
                      this.setState({status_order: status})
                      onRefresh() 
                      this.setState({disablevalue:false })
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
          
        }

        const showModal = () =>
        {
            this.setState({modalvisible:true})
        }

        const hideModal = () =>
        {
            this.setState({modalvisible:false})
            this.setState({modalhide:true})
        }
  
        
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor={'#040468'} barStyle="light-content" ></StatusBar>  

                { this.state.error === '1' ?  
                <View refreshControl={<RefreshControl refreshing={this.state.refreshing}  />} style={{backgroundColor:'#FFF' , height:'100%', padding:30}} >
                     <ActivityIndicator animating={true} color={'blue'} />
                </View> : null 
                }   
               
                <View style={styles.topview}>
                    <Title style={styles.titles}>Business Information</Title>

                    <View style={styles.orderview}> 
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="account-multiple" size={24} color="#FFF" />
                            <Text style={styles.text}>User: {this.state.user_name}</Text>
                        </View>
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="phone" size={24} color="#FFF" />
                            <Text   style={styles.text}>Mobile: { this.state.mobile }</Text> 
                            <Button style={styles.iconbtn} uppercase={false} color="white" onPress={()=>{Linking.openURL('tel:{'+this.state.mobile+'}');}} icon="phone" mode="contained">
                                Call
                            </Button>
                        </View>
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="currency-inr" size={24} color="#FFF" />
                            <Text style={styles.text}> Total Price: { this.state.totalprice } </Text>
                        </View>

                        <View style={styles.info} >
                            <Icon style={styles.icons} name="calendar-edit" size={24} color="#FFF" />
                            <Text style={styles.text}> Special Instructions: { this.state.special_instructions } </Text>
                        </View>
         
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="calendar-multiple-check" size={24} color="#FFF" />
                            <Text style={styles.text}>Date: {this.state.day}</Text>
                        </View>
                    
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="map-marker-radius" size={24} color="#FFF" />
                            <Text style={styles.text}>Address: {this.state.address}, {this.state.landmark}, {this.state.pincode}</Text>
                           
                        </View>

                        <View style={styles.btnvw}>
                        <Button style={styles.iconbtn1} color="#fff"  icon="map-marker" uppercase={false} onPress={getuser} mode="contained">Open Google Maps</Button>
                        </View>

                    </View>
                </View>

                <View style={styles.bottomview}>
  
                    <Text style={styles.orders}>{this.props.route.params.order_token}</Text>
                   
                    <Divider style={styles.divider}/>
                


                <ScrollView style={styles.menuview}> 

                {
                    this.state.food.map((item,index) => (

                    <View style={styles.info} >
                        <Icon style={styles.icons} name="food" size={24} color="#F57F0A" />
                        <Text style={styles.foodtext}>{item.name} x {item.quantity}</Text>
                        <Text> {item.total}</Text>
                    </View>

                    ))

                }
                    

                </ScrollView>

                  

                    <Provider>
                        <Portal>
                            <Modal  visible={this.state.modalvisible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                            <TextInput
                            label="Reason for cancellation"
                            mode="outlined"
                            multiline={true}
                            onChangeText={(value) => this.setState({reason: value})}
                            />
                            <Button style={styles.btncancel} icon="check"  onPress={() => updateorder(status4)} color="red"  mode="contained">
                               Confirm
                            </Button>
                            </Modal>
                        </Portal>
                    </Provider>

                    <View style={styles.notes}>
                        <View style={styles.statusview}>
                        <Text style={styles.statustext} > <Icon name="clock-check" size={26} color="#6BC04B" /> Order Status: {this.state.order_status}</Text>
                        </View>
                        {this.state.order_status == "Placed" ?
                        <View>
                            <Button style={styles.custombtn} mode="contained" loading={this.state.loading} onPress={() => updateorder(status1)} disabled={this.state.disablevalue}>Confirmed & Processing</Button>
                            <Button style={styles.custombtn} color="red" mode="outlined" onPress={showModal}  >Cancel Order</Button>
                        </View>:this.state.order_status == "Confirmed & Processing" ?
                        <View>
                             <Button style={styles.custombtn} mode="contained" loading={this.state.loading} onPress={() => updateorder(status2)} disabled={this.state.disablevalue} >Packed & Out for delivery</Button>
                        </View>
                        :this.state.order_status == "Packed & Out for Delivery" ?
                        <View>
                             <Button style={styles.custombtn} mode="contained" loading={this.state.loading} onPress={() => updateorder(status3)} disabled={this.state.disablevalue} >Delivered</Button>
                        </View>:this.state.order_status == "Delivered" ?
                        <View>
                        </View>:this.state.order_status == "Order Cancelled" ?
                       <View style={styles.statusview}>
                           <Text style={styles.statustext} > <Icon name="close-circle" size={30} color="#900"  /> Order Cancelled </Text>
                       </View>:null
                        
                        }
                        <Paragraph style={styles.para}></Paragraph>
                    </View>
                </View>
            
              
            </View>
        )
    }
}


const styles ={

    container:{
        flex:1,
        backgroundColor: '#040468',
    },
    btncancel: {
        marginTop:10,
    },
    custombtn: {
        margin:10,
    },
    containerStyle: {
        backgroundColor: 'white', 
        padding:20,
        margin:20,
        height:200,

    },
    providerstyle: {
        position:'absolute'
    },
    info:{
        flexDirection:'row',
        marginTop:10

    },
    iconbtn: {
        position:'absolute',
        right:0,
        bottom:0
    },
    btnvw: {
        margin:8
    },
    iconbtn1:
    {
       
    },
    topview:{
        flex:1,
        padding:10,
        backgroundColor:'#040468'
        
    },
    bottomview:{
        flex:1.8,
        marginTop:10,
        padding:10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor:'#FFF'
    },
    icons:{
        flex:1
    },
    text:{
        flex:8,
        fontSize:15,
        color:'#FFF',
        fontFamily: 'Nunito-Regular',
    },
    foodtext:{
        flex:8,
        fontSize:16,
        fontFamily: 'Nunito-Regular',
    },
    divider:{
        marginTop:10,
        fontStyle:'bold'
    },
    itemscontained:{
        padding:20,
    },
    titles:{
        textAlign:'center',
        color:'#FFF',
        fontFamily: 'Nunito-Regular',
    },
    notes:{
        marginTop:10,
        flex:1,
    },
    para:{
        fontFamily: 'Nunito-Regular',
    },
    image:{
        flex:2,
        width:'100%',
        height:25
    },
    Orderview:{
        flex:1
    },
    menuview:{
        flex:3
    },
    orders:{
        fontWeight:'bold',
        fontSize:16,
        marginTop:10
    },
    quotes:{
        flexDirection:'row',
        marginTop:5
    },
    sl:{
        flex:1,
        textAlign:'center'
    },
    list_quotes:{
        flex:6,
        textAlign:'center'
    },
    dates:{
        flex:2,
        textAlign:'center'
    },
    dropdown: {
        margin:10,
        padding:0,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius:5,

    
    },
    pickerstyle: {
        padding:0,
     
        borderColor: "gray",
        borderWidth: 1,
        borderRadius:5,

    },
    btnview: {
        margin:10,
    },
    statusview: {
        margin:10
    },
    statustext: {
        fontWeight:'bold',
        fontSize:20,
        textAlign:'center',
        color:'#040468'
    }

}

function MapToprops(state){
    return {
        counter:state.counter
    }
}

function MapDispatch(dispatch) {
    return {
        IncreaseCounter : () => dispatch({type:'INCREASE_COUNTER'}),
        DecreaseCounter : () => dispatch({type:'DECREASE_COUNTER'})
    }
}

export default connect(MapToprops,MapDispatch)(Processorder);



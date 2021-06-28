import React , {Component} from 'react';
import {Text , View  , ScrollView, StatusBar, FlatList,RefreshControl,TouchableOpacity } from 'react-native';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { Title , Divider , Button, Paragraph , Headline , RadioButton,TextInput,ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
import { connect } from 'react-redux'





class Processorder extends Component {
    state = {business:[] , food:[] ,error:'1', order_id:'' ,status_order:'', loading:false ,pageloading:false, user_id:'' ,user_name:'',totalprice:'',mobile:'',day:'', name:'' , price:'' , quantity:'' , total:'',created_at:'',order_status:'',address:'',landmark:'',pincode:''}


    async componentDidMount()
    {
        this.setState({order_token:this.props.route.params.order_id})
        this.business_info()
        this.setState({processed:this.props.route.params.processed})
        this.food_items();
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
            this.setState({user_id:res[0].user_id ,address:res[0].address,landmark:res[0].landmark,pincode:res[0].pincode, user_name: res[0].name , totalprice: res[0].price  ,mobile:res[0].mobile,day:res[0].date, loading:false , quantity:res[0].quantity, total:res[0].total, created_at:res[0].created_at,order_status:res[0].status })
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

       
      

        const updateorder = () => {
            var order_id = this.props.route.params.order_id;
            var orderstatus = this.state.status_order;
            alert(this.state.order_status);
            if(orderstatus == '')
            {
                alert("Please choose a valid Order status")
            }
            else
            {
            this.setState({loading:true })
            var dataObj = {}
            dataObj.order_id = order_id,
            dataObj.status = orderstatus,

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
                  alert(res.msg)
                  this.setState({loading:false })
                  this.setState({status_order: orderstatus})
                  onRefresh() 
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
                            <Text style={styles.text}>Mobile: { this.state.mobile }</Text>
                        </View>
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="currency-inr" size={24} color="#FFF" />
                            <Text style={styles.text}> Total Price: { this.state.totalprice } </Text>
                        </View>
         
                        <View style={styles.info} >
                            <Icon style={styles.icons} name="calendar-multiple-check" size={24} color="#FFF" />
                            <Text style={styles.text}>Date: {this.state.day}</Text>
                        </View>

                        <View style={styles.info} >
                            <Icon style={styles.icons} name="map-marker-radius" size={24} color="#FFF" />
                            <Text style={styles.text}>Address: {this.state.address}, {this.state.landmark}, {this.state.pincode}</Text>
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

                    <Divider style={styles.divider}/>

                
                    <View style={styles.notes}>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-around'}}>
                          
                            <TouchableOpacity>
                                <Text style={{fontSize:20}} onPress={this.props.DecreaseCounter}>Decrease</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize:20}}>{this.props.counter}</Text>
                            <TouchableOpacity>
                                <Text style={{fontSize:20}} onPress={this.props.IncreaseCounter}>Increase</Text>
                            </TouchableOpacity>
                           
                        </View>

                        <View style={styles.statusview}>
                        <Text style={styles.statustext} > <Icon name="clock-check" size={26} color="#6BC04B" /> Order Status: {this.state.order_status}</Text>
                        </View>
                        {this.state.order_status == "" ?
                        <View style={styles.dropdown}>
                            <Picker style={styles.pickerstyle} onValueChange={(value) => this.setState({status_order: value})} >
                                <Picker.Item label="Update status..." value="" />
                                <Picker.Item label="Confirm Order" value="Confirmed" />
                                <Picker.Item label="Packed" value="Processing Food" />
                                <Picker.Item label="Out for Delivery" value="Out for Delivery" />
                                <Picker.Item label="Delivered" value="Delivered" />
                                <Picker.Item label="Cancel Order" value="Cancelled" />
                            </Picker>   
                        </View>:this.state.order_status == "Confirmed" ?
                        <View style={styles.dropdown}>
                            <Picker style={styles.pickerstyle} onValueChange={(value) => this.setState({status_order: value})} >
                                <Picker.Item label="Update status..." value="" />
                                <Picker.Item label="Packed" value="Processing Food" />
                                <Picker.Item label="Out for Delivery" value="Out for Delivery" />
                                <Picker.Item label="Delivered" value="Delivered" />
                                <Picker.Item label="Cancel Order" value="Cancelled" />
                            </Picker>   
                        </View>:this.state.order_status == "Processing Food" ?
                            <View style={styles.dropdown}>
                            <Picker style={styles.pickerstyle} onValueChange={(value) => this.setState({status_order: value})} >
                                <Picker.Item label="Update status..." value="" />
                                <Picker.Item label="Out for Delivery" value="Out for Delivery" />
                                <Picker.Item label="Delivered" value="Delivered" />
                                <Picker.Item label="Cancel Order" value="Cancelled" />
                            </Picker>   
                            </View>:this.state.order_status == "Out for Delivery" ?
                            <View style={styles.dropdown}>
                                <Picker style={styles.pickerstyle} onValueChange={(value) => this.setState({status_order: value})} >
                                    <Picker.Item label="Update status..." value="" />
                                    <Picker.Item label="Delivered" value="Delivered" />
                                    <Picker.Item label="Cancel Order" value="Cancelled" />
                                </Picker>   
                            </View>
                        :this.state.order_status == "Delivered" ?
                        <View style={styles.statusview}>
                            <Text style={styles.statustext} > <Icon name="check-circle" size={30} color="#6BC04B" /> {this.state.order_status}</Text>
                        </View>
                       :this.state.order_status == "Cancelled" ?
                       <View style={styles.statusview}>
                           <Text style={styles.statustext} > <Icon name="close-circle" size={30} color="#900" /> Cancelled order</Text>
                       </View>
                      :
                        
                        <View style={styles.dropdown}>
                        <Picker style={styles.pickerstyle} onValueChange={(value) => this.setState({status_order: value})} >
                            <Picker.Item label="Update status..." value="" />
                            <Picker.Item label="Confirm Order" value="Confirmed" />
                            <Picker.Item label="Packed" value="Packed" />
                            <Picker.Item label="Out for Delivery" value="Out for Delivery" />
                            <Picker.Item label="Delivered" value="Delivered" />
                            <Picker.Item label="Cancel Order" value="Cancelled" />
                        </Picker>   
                    </View>
                    }
                   { this.state.order_status == "Delivered" ?
                        <View>
                           
                        </View>
                      :this.state.order_status == "Cancelled" ?
                      <View>
                         
                      </View>
                    :
                      <View style={styles.btnview}>
                        <Button icon="check" loading={this.state.loading} mode="outlined" onPress={updateorder}>Process Order</Button>
                     </View>   
                       
                    }
                       
                        <Paragraph style={styles.para}>Note : All orders are timebound , hence quotations are expected in a timely manner.</Paragraph>
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
    info:{
        flexDirection:'row',
        marginTop:10

    },
    topview:{
        flex:1,
        padding:10,
        backgroundColor:'#040468'
        
    },
    bottomview:{
        flex:2,
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
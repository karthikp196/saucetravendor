import React , {Component} from 'react';
import {Text , View  , ScrollView, StatusBar, FlatList,RefreshControl,Image } from 'react-native';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { Title , Divider , Button, Paragraph , Headline , RadioButton,TextInput,ActivityIndicator,Switch  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import { HeaderStyleInterpolators } from '@react-navigation/stack';





class Inventory extends Component {
    state = {business:[] ,dishstatus:true, food:[],orders:[] ,error:'1', order_id:'' ,status_order:'', loading:false ,pageloading:false, user_id:'' ,user_name:'',totalprice:'',mobile:'',day:'', name:'' , price:'' , quantity:'' , total:'',created_at:'',order_status:'',address:'',landmark:'',pincode:''}


    
    async componentDidMount()
    {
        this.setState({order_token:this.props.route.params.order_id})
        this.inventory_info()
        this.setState({processed:this.props.route.params.processed})
    }


    async inventory_info() 
    {
        const value = await AsyncStorage.getItem('restoken')
        const mobile = await AsyncStorage.getItem('mobile')
        fetch('https://foody-database.herokuapp.com/api/rest-eats',{
        method: 'POST',
        header:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"rest_token":value})
        })
        .then((response) => response.json())
        .then((res) => {
            console.log(res)
            this.setState({orders:res , loading:false , masterdata:res , error:''})
            alert(res.results[0].email)
            // console.log(res)
            // console.log(res.order_token)
            //this.setState({orders:res , loading:false , masterdata:res })
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

        const onToggleSwitch = () => 
        {   
            if(this.state.dishstatus == false)
            {
                this.setState({dishstatus:true})
                // alert("Dish Enalbled")
            }
            else
            {
                this.setState({dishstatus:false})
                // alert("Dish Disabled")
            }
        }

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
            <View style={styles.laycontainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
         
          <View>
              <Text style={styles.cartheading}>Your Inventory</Text>
          </View>
     
     
         <ScrollView>
     
             <View style={styles.foodview}>
                 <View style={{flex: 1}}>
                     <View style={styles.imagediv}>
                         <Image style={styles.foodimage} source={require('../assets/images/food.jpg')} />
                     </View>
                 </View>
                 <View style={{flex: 2}}>
                     <Text style={styles.headingtext}>Double Cheese Margherita Pizza</Text>
                     <Text style={styles.captionprice}>RS.110</Text>
                 </View>
                 <View style={{flex: 1}}>
                    <Switch value={this.state.dishstatus} color="#040468" onValueChange={onToggleSwitch}  />
                 </View>  
             </View>  
             
             <Divider></Divider>
     
          
         </ScrollView>
     
        
            
     
         </View>
        )
    }
}


const styles ={
    laycontainer: {
       
        height:'100%',
    },

    imagview:
    {
        position:'relative',
    },
    headingtext: {
       
        fontSize:17,
        color:'#12074c',
        paddingLeft:7,
        alignItems:'center',
        justifyContent:'center',
        fontFamily:'Karla-SemiBold'
      },
      cartheading: {
        fontSize:24,
        color:'#12074c',
        textAlign:'center',
        fontFamily:'Karla-SemiBold',
        margin:10
      },
      captionprice:
      {
        color:'#aa1116',
        paddingLeft:7,
        fontFamily:'Karla-SemiBold'
      },
      caption:{
        color:'#7a7a7a',
        paddingLeft:7,
        fontFamily:'Montserrat-Medium'
        
      }  ,
      captiontxt: {
        color:'#12074c',
        fontSize:13,
        
      },  
    images:{
      width: '100%',
      height:350,
      top:0,
      left:0,
      
    },
    captiontxt: {
        color:'#fff',
        padding:10,
        fontFamily:'Karla-SemiBold'
      },
    
    overlaydiv: {
        position:'absolute',
        width:'100%',
        height:350,
        top:0,
        left:0,
        backgroundColor:'black',
        opacity:0.45,
    },
    overlaytxt:
    {
        position:'absolute',
        width:'100%',
        bottom:50,
        padding:10
    },  
    headingtextwhite:
    {
        color:'#fff',
        fontSize:28,
        fontFamily:'Karla-Bold'
    },
    foodview: {
        flex: 1,
        flexDirection:'row',
        padding:10,
        margin:5,
        
    },
    imagediv:
    {
        width:'90%'
    },
    foodimage:
    {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderRadius:4,
    },
    flxstyle:
    {
        flex: 1,
        flexDirection:'row',
        padding:10,
    },
    divtxt: {
        color:'white',
        fontSize:17,
        fontFamily:'Karla-SemiBold'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:'#e93c42',
        padding:5
      },
      buttonview: {
          margin:15
      }
  
}

export default Inventory;
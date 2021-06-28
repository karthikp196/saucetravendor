import React , {Component} from 'react';
import {Text , View , TextInput , StatusBar , ScrollView , RefreshControl , Image } from 'react-native';
import { Card , Searchbar , Badge, Title , Paragraph , Button , List , Divider , ActivityIndicator,Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('mobile')
      console.log(value)
      return value
    } catch(e) {
      // error reading value
    }
  }



class Inventory extends Component {

    state = {orders:[] , masterdata:[] ,dishstatus:true, name:['Hitesh','Raju'] , loading:true , refreshing:false , token:'' , value:'' , error:''};

    async componentDidMount()
    {
        const value = await AsyncStorage.getItem('mobile')
        this.setState({value:value})
        this.apicall()
        console.log(this.state.value)
        

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.apicall();
            //Put your Data loading function here instead of my this.loadData()
        });

        // if(value == null)
        // {
        //     alert("No value")
        //     this.props.navigation.navigate('Login')
        // }
        // else
        // {
        //     alert("Value is there")
        // }

        // fetch('https://music-library-mcr-codes.herokuapp.com/artists',{
        //     method: 'GET',
        //     header:{
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     })
        //     .then((response) => response.json())
        //     .then((res) => {

        //         this.setState({orders:res , loading:false })
        //         //alert(this.state.orders[0].title)
        //         // alert(res[1].order_token)   
        //     })
        //     .catch(function(error) {
        //     alert('There has been a problem with your fetch operation: ' + error.message);
        //     console('There has been a problem with your fetch operation: ' + error.message);
        //     // ADD THIS THROW error
        //         throw error;
        //     });
        
    }

    async apicall() 
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
            // console.log(res)
            // console.log(orders..status)
            //this.setState({orders:res , loading:false , masterdata:res })
            // // alert(res[1].order_token)   
        })
        .catch(function(error) {
        alert('There has been a problem with your fetch operation: ' + error.message);
        console('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
            throw error;
        });
    }

    logout = () => {
   
        AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        this.props.navigation.navigate('Login')
        
    }

    searchFilterFunction = text => {

        if(text)
        {
            this.setState({value: text});

            console.log(this.state.value)
            const newData = this.state.orders.filter(item => {
            const itemData = item.order_id.toLowerCase();
            const textData = text.toLowerCase();
            return itemData.indexOf(textData) > -1;
            });

            this.setState({ orders: newData });
            this.setState({value: text});
        }
        else
        {
            this.setState({ orders: this.state.masterdata })
            this.setState({value: text});
        }    

    }



    render(){

        const onToggleSwitch = (id,status) => 
        {   
            var eats_id = id;
            var status = status;
            if(status == "Available")
            {
                var foodstatus = "Not Available";
            }
            else{
                var foodstatus = "Available";
            }
             var dataObj = {}
            dataObj.eats_id = eats_id,
            dataObj.status = foodstatus,

            fetch('https://foody-database.herokuapp.com/api/eats-status',{
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
                  alert("Food Status Updated successfully")
                  this.setState({loading:false })
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

        const onRefresh = () =>
        {
            console.log("Refreshed")
            this.apicall()
            this.setState({error:''})
        }
    
        return(
            <View style={styles.container}>

                <StatusBar backgroundColor={'#FFF'} barStyle="dark-content" ></StatusBar>
               
                { this.state.error === '1' ?  
                <View refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={onRefresh} />} style={{backgroundColor:'#FFF' , flex:1 , padding:30}} >
 
                    <Text style={styles.titles}>No orders yet..</Text>
                    <Text style={styles.texts}><Icon name="refresh" size={18}></Icon> Scroll here ..</Text>
                </View> : null 
                }   

                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={onRefresh} />}>
                    <ActivityIndicator animating={this.state.loading} color={'blue'} />
                    {
                    this.state.orders.map((item,index) => (
                        <View key={ index }>        
                            <View style={styles.listview}>
                                <View style={styles.orders}>
                                    <Text style={styles.ordertext}>{item.name}</Text>
                                   
                                    <Text>{item.status}</Text> 
                                    
                                </View>
                                {item.status == "Available" ?
                                    <View style={styles.actions}>
                                        <Switch value={true} color="#040468" onValueChange={() => onToggleSwitch(item.id,item.status)}  />
                                    </View>:
                                    <View>
                                        <Switch value={false} color="#040468" onValueChange={() => onToggleSwitch(item.id,item.status)}  />
                                    </View>
                                }

                            </View>
                            <Divider />
                        </View>

                    ))
                    }  
                </ScrollView>
                <Button icon="logout" onPress={this.logout}>Logout</Button>
            </View>
        )
    }
}

const styles ={

    container:{
        flex:1,
        backgroundColor: '#FFF',
        paddingLeft:10,
        paddingRight:10
    },
    textAreaContainer: {
        borderColor: '#000',
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        Textcolor:'#FFF'
    },
    cardcolor:{
        backgroundColor:'#F9F9F9',
        marginTop:10,
        borderRadius:5,

    },
    search:{
        marginTop:10,
        marginBottom:20
    },
    listview:{
        flexDirection:'row',
        padding:10,
        marginBottom:10
    },
    orders:{
        flex:3,
    },
    actions:{
        flex:1,
    },
    ordertext:{
        fontFamily: 'Nunito-Regular',
        fontWeight:'bold'
    },
    images:{
        alignSelf: 'center',
        justifyContent:'center',
        alignItems:'center',
        resizeMode: 'contain',
        width: '50%',
    },
    titles:{
        paddingTop: 5,
        paddingBottom: 10,
        fontSize: 20,
        color: "#000",
        alignSelf: "center",
        fontFamily: 'Nunito-Regular',
    },
    texts:{
        textAlign:"center",
        color:"#333",
        fontSize:18,
        paddingHorizontal:5,
        fontFamily: 'Nunito-Regular',
    }
    
    

}

export default Inventory;




/**
 * Created by alan on 16/1/19.
 */
var $ = require('/components/common/base/base.js');

var storage={
    init:function(){
        // 待用
    },
    // 本地持久化存储
    local:{
        _init:function(){
            var dataBuffer=document.getElementsByName("data_buffer")[0];
            console.log(dataBuffer);
            if(!dataBuffer){
                var formDataBuffer=document.createElement("form");
                formDataBuffer.name="data_buffer";
                var inputDataStorage=document.createElement("input");
                inputDataStorage.setAttribute("type","hidden");
                inputDataStorage.setAttribute("id","data_storage");
                inputDataStorage.setAttribute("style","behavior: url(#default#userdata)");

                formDataBuffer.appendChild(inputDataStorage);
                document.body.appendChild(formDataBuffer);
            }
        },
        get:function(key){
            var data;
            if(window.localStorage){
                data = localStorage.getItem(key);
            }else{
                this._init();
                var oPersist=data_buffer.data_storage;
                oPersist.load("shoppingList");
                data = oPersist.getAttribute(key);
            }
            return data;
        },
        set:function(key,value){
            if(window.localStorage){
                localStorage.setItem(key,value);
            }else{
                this._init();
                var oPersist=data_buffer.data_storage;
                oPersist.setAttribute(key,value);
                oPersist.save("shoppingList");
            }
        },
        delete:function(key){
            if(window.localStorage){
                localStorage.removeItem(key);
            }else{
                this._init();
                var oPersist=data_buffer.data_storage;
                oPersist.load('shoppingList');
                oPersist.removeAttribute(key);
                oPersist.save('shoppingList')
            }
        }
    },
    // 本地当前存储
    session:{
        get:function(key){
            var data;
            if(window.sessionStorage){
                data = sessionStorage.getItem(key);
            }else{
                data = $.cookie.getRaw(key);
            }
            return data;
        },
        set:function(key,value){
            if(window.sessionStorage){
                sessionStorage.setItem(key,value);
            }else{
                $.cookie.setRaw(key,value);
            }
        },
        delete:function(key){
            if(window.sessionStorage){
                sessionStorage.removeItem(key,value);
            }else{
                $.cookie.del(key);
            }
        }
    }
};
module.exports=storage;

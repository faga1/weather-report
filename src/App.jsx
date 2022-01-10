import React from 'react';
import { Upload, Button } from 'antd';
import Papa from 'papaparse'; // 解析cvs插件 市面上使用较多的
import jschardet from 'jschardet'; // 编码识别
import cloudy from './image/多云.png'
import sunny from './image/晴天.png'
import rainy from './image/雨天.png'
import './App.css'


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvParseData: [],
    };
  }
  // 检查编排
  checkEncoding = (base64Str) => {
    //这种方式得到的是一种二进制串
    const str = atob(base64Str.split(";base64,")[1]); // atob  方法 Window 对象 定义和用法 atob() 方法用于解码使用 base-64 编码的字符
    //要用二进制格式
    let encoding = jschardet.detect(str);
    encoding = encoding.encoding;
    // 有时候会识别错误
    if(encoding === "windows-1252"){
      encoding = "ANSI";
    }
    return encoding;
  }
  render() {
    const _this = this;
    const props = {
      beforeUpload: file => {
        const fReader = new FileReader();
        fReader.readAsDataURL(file); //  readAsDataURL 读取本地文件 得到的是一个base64值
        fReader.onload = function(evt){// 读取文件成功
          const data = evt.target.result;
          const encoding = _this.checkEncoding(data);
          //papaparse.js 用来解析转换成二维数组
          Papa.parse(file, {
            encoding: encoding,
            complete: function(results) {        // UTF8 \r\n与\n混用时有可能会出问题
              const res = results.data;
              if(res[res.length - 1] === ""){    //去除最后的空行 有些解析数据尾部会多出空格
                res.pop();
              }
              // 当前res 就是二维数组的值 数据拿到了 那么在前端如何处理渲染 就根据需求再做进一步操作了
              res.pop()
              res.shift()
              res.forEach(item=>{
                if(item[1].split('转')[0]==='多云'||item[1].split('转')[0]==='阴'){
                  item[1]=cloudy
                }else if(item[1].split('转')[0]==='晴'){
                  item[1]=sunny
                }else{
                  item[1]=rainy
                }
                
              })
              console.log(res);
              _this.setState({csvParseData:res});
            }
          });

        }
        return false;
      },
    };
    return (
      <div>
        <Upload {...props}>
          <Button>
          刷新天气
          </Button>
        </Upload>
        <div className='container' style={{display:this.state.csvParseData.length?'block':'none'}}>
          {
            this.state.csvParseData.map(item=>{
              return (
                <div className='weather-item' key={item[0]}>
                  <div className='day'>{item[0]}</div>
                  <img src={item[1]} alt='天气'></img>'
                  <div className='weather-info'>
                    <div className='temperature'>气温:{item[3]+'-'+item[2]+'℃'}</div>
                    <div className='wind'>风向:{item[4]}{item[5]}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      
    );
  }
}
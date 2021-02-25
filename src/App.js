import './App.css';
import {Layout, Typography, Progress} from 'antd';
import styled from 'styled-components'
import {useForm} from "react-hook-form";
import React, {useState, useEffect} from 'react';
import {LoadingOutlined} from '@ant-design/icons';
import io from 'socket.io-client';


function App() {
    const {Header, Content} = Layout;
    const {Title} = Typography;
    const axios = require('axios');

    const [loader, setLoader] = useState(false);
    const [response, setResponse] = useState({});
    const [gis, setGis] = useState({});
    const [flamp, setFlamp] = useState({});
    const [yandex, setYandex] = useState({});


    const {register, handleSubmit, errors} = useForm();
    const onSubmit = (data) => {
        setLoader(true);
        console.log(data);
        axios.post('http://127.0.0.1:5456/create/image', {
            data
        }, {withCredentials: true})
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        let ioClient = io.connect('http://localhost:5456')
        ioClient.on('connect', socket => {
            ioClient.on('eventClient', (data) => {
                console.log(data)
                setResponse(data);
                switch (data.parser) {
                    case 'Gis':
                        setGis(data)
                        break;
                    case 'Flamp':
                        setFlamp(data)
                        break;
                    case 'Yandex':
                        setYandex(data)
                        break;
                }
            });
        })

    }


    useEffect(() => {


    }, []);

    return (

        <Layout>
            <Header/>
            <Content>
                <Container>
                    <Title>Введите название компании с учетом регистра и пробелов</Title>
                    <SearchForm onSubmit={handleSubmit(onSubmit)}>
                        <SearchInput type="text" name='companyName' id='companyName'
                                     placeholder="Введите название компании"
                                     ref={register(
                                         {required: true}
                                     )}/>
                        <SearchSubmit type='submit' value='Найти'
                                      name='submit'
                                      id='submit'
                        />

                    </SearchForm>
                    {errors.companyName && <span>Введите название компании.</span>}
                    {loader && <ContainerResult>
                        <ParserContainer>
                            {gis.isFinish ?
                                [
                                    (
                                        gis.isErrorFinish ?
                                            <Progress type="circle" percent={100} width={25} status="exception"
                                                      key='0'/> :
                                            <Progress type="circle" percent={100} width={25} key='0'/>
                                    )

                                ]
                                :
                                <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                            <ResultSpan>{gis.value}</ResultSpan>
                        </ParserContainer>
                        <ParserContainer>
                            {flamp.isFinish ?
                                [
                                    (
                                        flamp.isErrorFinish ?
                                            <Progress type="circle" percent={100} width={25} status="exception"
                                                      key='0'/> :
                                            <Progress type="circle" percent={100} width={25} key='0'/>
                                    )

                                ]
                                :
                                <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                            <ResultSpan>{flamp.value}</ResultSpan>
                        </ParserContainer>
                        <ParserContainer>
                            {yandex.isFinish ?
                                [
                                    (
                                        yandex.isErrorFinish ?
                                            <Progress type="circle" percent={100} width={25} status="exception"
                                                      key='0'/> :
                                            <Progress type="circle" percent={100} width={25} key='0'/>
                                    )

                                ]
                                :
                                <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                            <ResultSpan>{yandex.value}</ResultSpan>
                        </ParserContainer>
                    </ContainerResult>}
                </Container>
            </Content>
        </Layout>

    );
}

const ResultSpan = styled.span`
  margin-left: 20px;
  font-size: 14px;
  color: black;
`

const ParserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
`

const ContainerResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const SearchForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 0;
  text-align: inherit;
  padding: 6.5px 11px;
  font-size: 16px;
  border: 1px solid #d9d9d9;
  outline: none;
`
const SearchSubmit = styled.input`
  line-height: 1.5715;
  background: #1890ff;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 0 30px;
  outline: none;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20%;
  min-height: calc(100vh - 80px);
`


export default App;

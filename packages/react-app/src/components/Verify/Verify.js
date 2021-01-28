 /* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './verify.css';
import { Steps } from 'antd';
import { Grid, Button } from 'semantic-ui-react'
import SelectFiles from './SelectFiles'
import Preview from './Preview'

const { Step } = Steps;

const steps = [
  {
    title: 'Select Document',
  content: (args) => {return <SelectFiles setSubmitting={args.setSubmitting} setFileHash={args.setFileHash}/>} ,
  },
  {
    title: 'Verify Document',
    content: (args) => {return <Preview submitting={args.submitting} setSubmitting={args.setSubmitting} fileHash = {args.fileHash}/>},
  },
];

const verify=(props)=> {

  const [submitting, setSubmitting] = useState(false)
  const [fileHash, setFileHash] = useState("")


const [current, setCurrent] = useState(0)
  const next=()=> {
 
    setCurrent(current +1);
  }

 const prev=() =>{
    setCurrent(current-1);
  }

    return (
      <>
<div className="step__container">


    <Grid columns='two' >
    <Grid.Row>
      <Grid.Column width={12}>
        <div className="steps-content">{steps[current].content({ submitting, setSubmitting, setFileHash, fileHash})}</div>
        
        <div className="steps-action" style={{float:'right'}}>
       

             
        {current > 0 && (
            <Button style={{ background: "#4C51BF", color: "#fff" }} onClick={() => prev()}  className="button">
              Previous
            </Button>
          )}

             {current < steps.length - 1 && (
            <Button style={{ background: "#4C51BF", color: "#fff" }} type="primary" loading={submitting} onClick={() => {next()}} className="button">
              Verify
            </Button>
          )}
         
          
          {current === steps.length - 1 && (null
          )}
        </div>
      </Grid.Column>

      <Grid.Column width={4}>
        <div className='stepper__container'>
            <Steps direction="vertical" current={current} >
          {steps.map(item => (
            <Step key={item.title} title={item.title}  style={{display:'flex',border:'1px solid  #cbd5e0', alignItems:'center', padding:'10px'}}/>
          ))}
        </Steps>
        </div>
       
      </Grid.Column>
     
    </Grid.Row>
  </Grid>
  </div>
  </>
    );
 
}

export default verify
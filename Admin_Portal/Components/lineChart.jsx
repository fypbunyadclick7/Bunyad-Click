import React,{useState} from 'react';
import Chart from 'react-apexcharts';
//install : npm install react-apexcharts apexcharts//
function Linechart({product})
{
    const[option, setOption]= useState(
        {
            title:{ text:"Course Enrollment Analytics"},
            xaxis:{
                title:{text:"Course Enrollment in Days"},
                categories:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            },
            yaxis:{
                title:{text:"Courses Count"}                 
            }

        }
    );

    return(<React.Fragment>
        <div className='container-fluid mt-3 mb-3'>
            <center>
          <Chart type='line'
          width={1100}
          height={450}
          series={product}
          options={option }
          >
          </Chart>
          </center>
        </div>
    </React.Fragment>);
}

export default Linechart;
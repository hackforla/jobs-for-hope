import React from 'react';

import Banner from './Banner';
import './About.scss';

const About = (props) => {
  return(
    <div>
      <Banner titleUpper={'A Paycheck With'} titleLower={'A Purpose'} imageName='homeless_sitting' />
      <h2 style={{margin: '25px', fontSize: '2em'}}>Coming Soon</h2>
    </div>
  );
}

export default About;

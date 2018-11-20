import React from 'react';

import Banner from './Banner';
import './About.scss';

const About = (props) => {
  return(
    <div>
      <Banner titleUpper={'A Paycheck With'} titleLower={'A Purpose'} imageName='homeless_sitting' />
    </div>
  );
}

export default About;

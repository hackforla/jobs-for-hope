import React from 'react'
import BaseIcon from './BaseIcon'

const ErrorIcon = () => (
  <BaseIcon color='#FF0040'>
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='8' x2='12' y2='12' />
    <line x1='12' y1='16' x2='12' y2='16' />
  </BaseIcon>
)

export default ErrorIcon

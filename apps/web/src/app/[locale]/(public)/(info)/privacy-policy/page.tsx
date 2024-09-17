import React from 'react'

type Props = {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PrivacyPolicy = async (props: Props) => 
{
    await sleep(10000)

  return (
    <div>PrivacyPolicy</div>
  )
}

export default PrivacyPolicy
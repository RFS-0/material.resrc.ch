import { Component } from "solid-js"
import './focus-ring-styles.css'

export type FocusRingProps = {
  visible: boolean
}

export const FocusRing: Component<FocusRingProps> = (props) => {
  return (
    <span class={`base-focus-ring md3-focus-ring ${props?.visible ? 'md3-focus-ring--visible' : ''}`} ></span>
  )
}

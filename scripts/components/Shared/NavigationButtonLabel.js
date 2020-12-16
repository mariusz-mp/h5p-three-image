import React from 'react';
import './NavigationButton.scss';
import './NavigationButtonLabel.scss';
import {H5PContext} from "../../context/H5PContext";

export const getLabelFromInteraction = (interaction) => {
  return interaction.label;
};

export const getLabelPos = (label, globalLabel) => {
  return label.labelPosition === 'inherit' ? globalLabel.labelPosition : label.labelPosition;
};

export const getLabelText = (label, title) => {
  return label.labelText ? label.labelText : title;
};

export const isHoverLabel = (label, globalLabel) => {
  return !(label.showLabel === 'inherit' ? globalLabel.showLabel : label.labelPosition);
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);
    this.labelDivInner = React.createRef();
    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: '1.5em'
    };
  }

  onClick(e) {
    e.stopPropagation();
    if (!this.state.expandable) {
      return;
    }

    // This is done seperatly to ensure new height gets calculated
    this.setState({isExpanded: !this.state.isExpanded});

    if(!this.state.isExpanded) {
      setTimeout(() => {
        this.setState({divHeight: window.getComputedStyle(this.labelDivInner.current).height})
      }, 0);
    } else {
      setTimeout(() => {
        this.setState({divHeight: '1.5em'})
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
      if(this.props !== prevProps) {
        this.setState({expandable: this.isExpandable()}); 
      }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({expandable: this.isExpandable()});
    }, 0);
  }

  isExpandable() {
    if (this.labelDivInner.current.scrollWidth > this.labelDivInner.current.offsetWidth) {
      return true;
    }
    return false;
  }

  render() {
    const isExpanded = this.state.isExpanded === true ? 'is-expanded' : '';
    const canExpand = this.state.expandable === true ? 'can-expand' : '';
    const hoverOnly = this.props.hoverOnly === true ? 'hover-only' : '';
    const isEditor = this.context.extras.isEditor;

    return (
      <div className={`nav-label-container ${this.props.labelPos} ${isExpanded} ${canExpand} ${hoverOnly}`}>
        <div style={{height: this.state.divHeight}} className={`nav-label`}>
          <div ref={this.labelDivInner}
            className='nav-label-inner'>
            {this.props.labelText}
          </div>
        </div>
        {canExpand && <button className="nav-label-expand" tabIndex={isEditor ? '-1' : undefined} aria-label="expand-label"  onClick={this.onClick.bind(this) }>
            <div className="nav-label-expand-arrow"/>
          </button>}
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;

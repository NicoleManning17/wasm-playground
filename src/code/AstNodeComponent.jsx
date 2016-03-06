import React from 'react'
import focus from './focus'
import renderers from './renderers'

 var AstNodeComponent = React.createClass({
    getInitialState(){
        return {editable: this.props.node.type}
    },
    handleChange(e){
        this.setState({editable: e.target.value})
    },
    handleKeyDown: function(e){
        var node = this.props.node;
        var target = e.target
        switch(e.key){
            case 'Enter':
                e.preventDefault()
                if(this.state.editable.trim().length === 0){
                    break
                }
                node.changeType(this.state.editable)
                node.branchOut()
                this.props.notifyUp()
                break
            case 'Tab':
                e.preventDefault()
                if(this.state.editable.trim().length === 0){
                    break
                }
                node.changeType(this.state.editable)
                node.parent.addSiblingAfter(node)
                this.props.notifyUp()
                break
            case 'Backspace':
                if(this.state.editable.length === 0){
                    e.preventDefault()
                    this.remove()
                    focus.previousOfType(this.refs.typeName)
                }
                break
            case 'ArrowLeft':
                    if(target.selectionStart === 0 && target.selectionEnd === 0){
                        e.preventDefault()
                        focus.previousOfType(target)
                    }
                break
            case 'ArrowRight':
                    if(target.selectionStart === this.state.editable.length && target.selectionEnd === this.state.editable.length){
                        e.preventDefault()
                        if(!this.props.node.children.length && node.parent.parent && node.parent.isLastChild(node)){
                            node.parent.parent.addSiblingAfter(node.parent)
                            if(this.state.editable.trim().length === 0){
                                this.remove()
                            }
                            this.props.notifyUp(2)
                            break
                        }
                        focus.nextOfType(target)
                    }
                break
        }
    },
    remove(){
        var node = this.props.node;
        node.parent.removeChild(node)
        this.props.notifyUp(1)
    },
    handleBlur(){
        if(this.state.editable.trim().length === 0){
            this.remove()
        }
        var node = this.props.node;
        node.changeType(this.state.editable)
        this.forceUpdate()
    },
    componentDidMount(){
        this.refs.typeName && this.refs.typeName.focus()
    },
    handleNotify(generations){
        if(generations === 1){
            this.forceUpdate()
        }else{
            this.props.notifyUp(generations - 1)
        }
    },
    render(){
        var candidate = renderers[this.props.node.type]
        if(candidate){
             return candidate.bind(this)()
        }else{
            return renderers['generic'].bind(this)()
        }
    }
});

export default AstNodeComponent
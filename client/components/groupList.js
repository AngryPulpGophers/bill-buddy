import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import SocialModal from '../components/socialPromptModal';


function puke (obj) {
  return <pre>{JSON.stringify(obj, 2, ' ')}</pre>
}

export default class GroupList extends Component {
  componentWillMount(){
    this.props.getGroups()
  }

  render(){
    return(
      <div>
        <SocialModal
          userInfo={this.props.userInfo}
          stopSocialModal={this.props.stopSocialModal}
        />
      <div>
         {this.props.groups.map(function(group){
            return (

              <Link key={group.id} to={{pathname:'/groupView',query:{ id: group.id }}} title="groupView" className="callout callout-nav"><h5>{group.name} </h5>
              <span style = {group.balance>=0 ? {color:'green'} : {color:'red'}}>${group.balance}</span>
                  {group.members.map(function(member){
                    return (

                      <Link to={{pathname:'/profile', query:{ username: member.username }}}>
                      <img key={group.created_at + member.user_id} className="group-avatar" src={member.img_url} />
                      </Link>
                    )
                  })}
              </Link>
            )
          })}
      </div>
    </div>
    )
  }
}

GroupList.propTypes = {
  userInfo: PropTypes.object.isRequired,
  stopSocialModal: PropTypes.func.isRequired
}


import React from 'react';
import AddPostForm from "./AddPostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import PostEdit from "./PostEdit";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PostControl extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedPost: null,
      editing: false
    };
  }

  handleClick = () => {
    if (this.state.selectedPost != null) {
      this.setState({
        formVisibleOnPage: false,
        selectedPost: null,
        editing: false,
      });
    } else {
      const { dispatch } = this.props;
      const action = {
        type: 'TOGGLE_FORM'
      }
      dispatch(action);
    }
  };

  handleEditClick = () => {
    this.setState({editing: true});
  }

  handleAddingNewPostToList = (newPost) => {
    const { dispatch } = this.props;
    const { id, title, author, body, date, picture, vote } = newPost;
    const action = {
        type: 'ADD_POST',
        id: id,
        title: title,
        author: author,
        body: body,
        date: date,
        picture: picture,
        vote: vote,
    }
    dispatch(action);
    const action2 = {
      type: 'TOGGLE_FORM'
    }
    dispatch(action2);
  }

// we are adding the updated post to the postlist, it uses the same id and adds the new information given by the user (from postEdit)
  handleEditingPostInList = (postToEdit) => {
    const {dispatch} = this.props;
    const {id, title, author, body, date, picture, vote} = postToEdit;
    const action = {
      type: 'ADD_POST',
      id: id,
      title: title,
      author: author,
      body: body,
      date: date,
      picture: picture,
      vote: vote,
    }
    dispatch(action);
    this.setState({
      editing: false,
      selectedPost: null
    });
  };
  
  // handleEditingPostInList = (postToEdit) => {
  //   const editedMasterPostList = this.state.masterPostList
  //     .filter((post) => post.id !== this.state.selectedPost.id)
  //     .concat(postToEdit);
  //   this.setState({
  //     masterPostList: editedMasterPostList,
  //     editing: false,
  //     selectedPost: null,
  //   });
  // };
  
  handleDeletingPost = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_POST',
      id:id
    }
    dispatch(action);
    this.setState({selectedPost: null});
  }
  
  handleChangingSelectedPost = (id) => {
    const selectedPost = this.props.masterPostList[id];
    this.setState({selectedPost: selectedPost});
  };

  handleChangingSelectedUpvote = (upVoteId) => {
    const postToUpvote = this.props.masterPostList[upVoteId];
    const {dispatch} = this.props;
    const {id, title, author, body, date, picture, vote} = postToUpvote;
    const upvote = vote + 1;
    const action = {
      type: 'ADD_POST',
      id: id,
      title: title,
      author: author,
      body: body,
      date: date,
      picture: picture,
      vote: upvote
    }
    dispatch(action);
  };

  handleChangingSelectedDownvote = (downVoteId) => {
    const postToDownvote = this.props.masterPostList[downVoteId];
    const {dispatch} = this.props;
    const {id, title, author, body, date, picture, vote} = postToDownvote;
    const downvote = vote -1;
      if (vote > 0) {
        const action = {
          type: 'ADD_POST',
          id: id,
          title: title,
          author: author,
          body: body,
          date: date,
          picture: picture,
          vote: downvote,
        }
      dispatch(action);
    }
  };

  render (){
  let currentlyVisibleState = null;
  let buttonText = null;

  if (this.state.editing){
    currentlyVisibleState = <PostEdit post={this.state.selectedPost} onEditPost={this.handleEditingPostInList} />
    buttonText = "Return to Posts";
  } else if (this.state.selectedPost != null){
    currentlyVisibleState = <PostDetail post={this.state.selectedPost} onClickingDelete={this.handleDeletingPost}
    onClickingEdit={this.handleEditClick} />
    buttonText = "Return to Posts";
  } else if (this.props.formVisibleOnPage) {
    currentlyVisibleState = <AddPostForm onNewPostCreation={this.handleAddingNewPostToList} />
    buttonText = "Return to Posts";
  } else {
    currentlyVisibleState = <PostList postList={this.props.masterPostList} onPostSelection={this.handleChangingSelectedPost} onUpvoteSelection={this.handleChangingSelectedUpvote} onDownvoteSelection={this.handleChangingSelectedDownvote}/>
    buttonText = "Add Post";
  }
  
    return(
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  }  
}

PostControl.propTypes = {
  masterPropList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    masterPostList: state.masterPostList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

PostControl = connect(mapStateToProps)(PostControl);

export default PostControl;
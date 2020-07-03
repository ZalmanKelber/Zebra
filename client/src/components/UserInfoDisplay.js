import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as actions from "../actions";
import { renderCanvas } from "../utils/renderCanvas";

class UserInfoDisplay extends Component {
  state = {
    edit: false,
    showPhotoUpload: false,
    photoUrl: this.props.user.photo || process.env.PUBLIC_URL + "/defaultProfilePhoto.png",
    photoFile: null,
    photoAdded: false,
    bioHTML: this.props.user.bio,
    location: this.props.user.location,
    name: this.props.user.name,
    follow: false,
    exceedMessage: false
  };

  componentDidMount = () => {
    if (this.props.user) {
      renderCanvas(this.state.photoUrl, "main-photo-display", this.props.user._id);
      document.getElementById("bio-content").innerHTML = this.props.user.bioDisplay;
    }
    if (this.props.auth && !this.props.isUser && this.props.user.followers.includes(this.props.auth._id)) {
      this.setState({ follow: true });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.photoUrl !== prevState.photoUrl) {
      renderCanvas(this.state.photoUrl, "main-photo-display", this.props.user._id);
    }
  }

  handleUpload = e => {
    e.preventDefault();
    this.setState({
      photoUrl: URL.createObjectURL(e.target.files[0]),
      photoFile: e.target.files[0],
      photoAdded: true
    });
  }

  handleEdit = (e, user) => {
    e.preventDefault();
    this.setState({ edit: true });
  }

  handleSave = async (e, profileId) => {
    e.preventDefault();
    const newFields = {
      bioContent: this.state.bioHTML,
      location: this.state.location,
      name: this.state.name,
      photo: this.state.photoUrl
    }
    if (this.state.photoAdded) {
      let photoString;
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        photoString = reader.result;
        newFields.photo = photoString;
        console.log("newFields: ", newFields);
        await this.props.changeUserInfo(newFields, profileId);
        window.location.reload();
      }, false);
      reader.readAsDataURL(this.state.photoFile);
    }
    else {
      await this.props.changeUserInfo(newFields, profileId);
      window.location.reload();
    }
  }

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      edit: false,
      showPhotoUpload: false,
      photoUrl: this.props.user.photo || process.env.PUBLIC_URL + "/defaultProfilePhoto.png",
      photoFile: null,
      photoAdded: false,
      bioHTML: this.props.user.bio,
      location: this.props.user.location,
      name: this.props.user.name
    });
  }

  handleChange = content => {
    if (content.length < 300) {
      this.setState({ bioHTML: content, exceedMessage: false });
    }
    else {
      this.setState({ exceedMessage: true });
    }
  }

  renderFollow = () => {
    if (this.state.follow) {
      return <b>unfollow</b>;
    }
    else {
      return "follow";
    }
  }

  toggleFollow = e => {
    e.preventDefault();
    this.setState({ follow: this.state.follow ? false : true });
    this.props.toggleFollow(this.props.user._id, this.props.auth._id);
  }

  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link"],
    ],
  }

  formats = [
    "bold", "italic", "underline", "strike", "link"
  ]


  renderInfo = isUser => {
    if (this.props.user) {
      const { user } = this.props;
      return (
        <div className="user-info-display">
          <div className="image-area">
            <div className="image-holder-outer">
              <div className="image-holder-inner">
                <canvas id="main-photo-display" />
              </div>
            </div>
            {
              this.state.edit && (
              <div className="edit-photo-display">
                <a href="" onClick={e => {
                  e.preventDefault();
                  this.setState({ showPhotoUpload: true })
                }}>
                  <b>change photo</b> <i className="material-icons md-12">edit</i>
                </a>
                {
                  this.state.showPhotoUpload &&
                  <form>
                    <input onChange={e => this.handleUpload(e)} type="file" name="file" id="file" />
                    <label htmlFor="file"><b>choose a file</b></label>
                  </form>
                }
              </div>
            )
            }
          </div>
          <div className="username-display">
            <p>
              <span>
                {this.state.name}
              </span>
            </p>
          </div>
          {
            this.state.edit && (
              <div className="ui form">
                <input type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value})}/>
              </div>
            )
          }
          <div className="location-display red-italic">
            <p>{this.state.location}</p>
          </div>
          {
            this.state.edit && (
              <div className="ui form">
                <input type="text" value={this.state.location} onChange={e => this.setState({ location: e.target.value})}/>
              </div>
            )
          }
          <div className="bio-display post-text">
            <span id={"bio-content"}></span>
            <span className="red-bar">{"n"}</span>
          </div>
          {
            this.state.edit &&
            <div className="ui form">
              <div className="field">
              {
                this.state.exceedMessage &&
                <div className="post-date red-italic">Maximum length exceeded</div>
              }
                <ReactQuill
                  theme="snow"
                  modules={this.modules}
                  formats={this.formats}
                  onChange={this.handleChange}
                  value={this.state.bioHTML}
                />
              </div>
            </div>
          }
          <div className="followers-display">
            <Link target="_blank" to={"/list/" + JSON.stringify(this.props.user.followers)} onClick={e => {
              if (!this.props.user) {
                e.preventDefault();
              }
            }}>
              {this.props.user.followers.length + " follower" + (this.props.user.followers.length !== 1 ? "s" : "")}
            </Link>
            <Link target="_blank" to={"/list/" + JSON.stringify(this.props.user.following)} onClick={e => {
              if (!this.props.user) {
                e.preventDefault();
              }
            }}>
              {this.props.user.following.length + " following"}
            </Link>
          </div>
          <div className="edit-options">
            {
              isUser && !this.state.edit &&
              <a href="" onClick={e => this.handleEdit(e, user)}>
                <b>edit profile</b> <i className="material-icons md-12">edit</i>
              </a>
            }
            {
              isUser && this.state.edit &&
              <a href="" onClick={e => this.handleSave(e, user._id)}>
                <b>save</b><i className="material-icons md-12">save</i>
              </a>
            }
            {
              isUser && this.state.edit &&
              <a href="" onClick={e => this.handleCancel(e)}>
                <b>cancel</b><i className="material-icons md-12">cancel</i>
              </a>
            }
            {
              !isUser && this.props.auth &&
              <a href="" onClick={e => this.toggleFollow(e)}>
                {this.renderFollow()}
              </a>
            }
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <>
        {this.renderInfo(this.props.isUser)}
      </>
    );
  }
}

const mapStateToProps = ({ auth, viewed }) => {
  return { auth, viewed };
}

export default connect(mapStateToProps, actions)(UserInfoDisplay);

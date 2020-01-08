import React, {useState, useEffect} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux'

const {Title} = Typography;
const {TextArea} = Input;

const Private = [
    {value: 0, label: 'Private'},
    {value: 1, label: 'Public'}
]

const Category = [
    {value: 0, label: 'Film & Animation'},
    {value: 0, label: 'Autos & Vehicles'},
    {value: 0, label: 'Music'},
    {value: 0, label: 'Pets & Animals'},
    {value: 0, label: "Sports"}
]

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState(0)
    const [Categories, setCategories] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [Thumbnail, setThumbnail] = useState('')

 

    // setting video title
    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value)
    }

    // setting video description
    const handleChangeDescription = (event) => {
        setDescription(event.currentTarget.value)
    }

    // setting video category
    const handleChangeOne = (event) => {
        setCategories(event.currentTarget.value)
    }

    // setting video privacy
    const handleChangeTwo = (event) => {
        setPrivacy(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(user.userData && !user.userData.isAuth){
            return alert('please log in first')
        }

        if(title === '' || Description ==='' || Categories==='' || FilePath==='' || Duration ==='' || Thumbnail===''){
            return alert('please fill out all the fields')
        }

        const variables = {
            writer: user.userData._id ,
            title : title,
            description: Description ,
            privacy: privacy ,
            filePath: FilePath ,
            category: Categories ,
            duration: Duration ,
            thumbnail: Thumbnail ,
        }

        Axios.post('/api/video/uploadVideo', variables)
        .then(res => {
            if(res.data.success){
                alert('Video uploaded successful')
                props.history.push('/')
            } else {
                alert('failed to upload video')
            }
        })
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(res => {
            if(res.data.success){
                console.log(res)
                let variable = {
                    filePath: res.data.filePath,
                    fileName: res.data.fileName
                }

                setFilePath(res.data.filePath)

                // generatee thumbnail with this filepath
                Axios.post('/api/video/thumbnail', variable)
                .then(res => {
                    if(res.data.success){
                        setDuration(res.data.fileDuration)
                        setThumbnail(res.data.thumbsFilePath)
                    } else {
                        alert('Failed to make the thumbnails')
                    }
                })

            } else {
                alert('failed to save the video')
            }
        })
    }


    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={80000000}   
                    >
                        {({ getRootProps, getInputProps}) => (
                            <div style={{width: '300px', height: '240px', border: '1px solid lightgrey', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Icon type="plus" style={{fontSize: '3rem'}} />
                            </div>
                        )}
                    </Dropzone>
                    {Thumbnail !== "" &&
                            <div>
                                <img src={`https://localhost:6000/${Thumbnail}`} alt="thumbnail" />
                            </div>
                    }

                </div>
                <br /><br />
                <label>Title</label>
                <Input onChange={handleChangeTitle} value={title} />
                <br /> <br />
                <label>Description</label>
                <TextArea
                    onChange={handleChangeDescription}
                    value={Description}
                />
                <br /><br />

                <select onChange={handleChangeTwo}>
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))} 
                </select>
                <br /><br />

                <select onChange={handleChangeOne} >
                    {Category.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br /> <br />

                <Button type="primary" size='large' onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UploadVideoPage

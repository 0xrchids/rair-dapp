import { useEffect, useState } from 'react';
import VideoItem from './videoItem.jsx';

const VideoList = props => {
	const [mediaList, setMediaList] = useState([]);
	const updateList = async () => {
		let response = await (await fetch('/api/media/list', {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json()
		if (response.success) {
			setMediaList(response.list)
		} else if (response?.message === 'jwt expired') {
			localStorage.setItem('token', undefined);
		}
	}

	useEffect(() => {
		if (localStorage.token) {
			updateList();
		}
	}, [])

	return <>
		{Object.keys(mediaList).map((item, index) => {
			return <VideoItem key={index} mediaList={mediaList} item={item} />
		})}
	</>
};

export default VideoList;
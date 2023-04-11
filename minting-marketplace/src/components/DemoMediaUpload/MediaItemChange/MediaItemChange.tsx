import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { MediaItemContainer } from './MediaItem.styled';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { rFetch } from '../../../utils/rFetch';
import PopUpChangeVideo from '../PopUpChangeVideo/PopUpChangeVideo';
import { IMediaItemChange } from '../types/DemoMediaUpload.types';

import './MediaItemChange.css';

const MediaItemChange: React.FC<IMediaItemChange> = ({
  item,
  setMediaList,
  index,
  mediaList,
  uploadSuccess,
  textFlag,
  uploadVideo,
  mediaId,
  getMediaList,
  editTitleVideo,
  setEditTitleVideo,
  newUserStatus,
  setUploadSuccess,
  beforeUpload
}) => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, [setModalIsOpen]);

  const [titleValue, setTitleValue] = useState<string>(item.title);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);

  const toggleTitleVideo = () => {
    setEditTitleVideo((prev) => !prev);
  };

  const onChangeTitle = (e) => {
    setTitleValue(e.target.value);
  };

  const closeEdit = () => {
    setTitleValue(item.title);
    toggleTitleVideo();
  };

  const changeTitleMediaItem = async (e) => {
    e.preventDefault();
    if (beforeUpload) {
      const newMediaList = mediaList;
      newMediaList[index].title = titleValue;
      setMediaList(newMediaList);
      toggleTitleVideo();
    } else {
      setDisabledBtn(true);
      Object.keys(mediaList).map((item) => {
        const fileData = mediaList[item];
        return fileData;
      });
      try {
        const request = await rFetch(`/api/media/update/${mediaId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: titleValue
          })
        });

        if (request.success && getMediaList) {
          toggleTitleVideo();
          setDisabledBtn(false);
          getMediaList();
        } else {
          setDisabledBtn(false);
        }
      } catch (e) {
        console.info(e);
        toggleTitleVideo();
        setDisabledBtn(false);
      }
    }
  };

  return (
    <MediaItemContainer
      editTitleVideo={editTitleVideo}
      className="col-12 media-item-title">
      {textFlag ? (
        <div>
          <p className="col-12">
            {item.title.length > 15
              ? item.title.substr(0, 6) +
                '...' +
                item.title.substr(item.title.length - 10, 10)
              : item.title}
          </p>
        </div>
      ) : (
        <div>
          {!editTitleVideo ? (
            <>
              <p className="col-12">
                {item.title.length > 15
                  ? item.title.substr(0, 6) +
                    '...' +
                    item.title.substr(item.title.length - 10, 10)
                  : item.title}
              </p>
              {newUserStatus ? (
                <button
                  disabled={!newUserStatus}
                  className={`btn btn-success rounded-rairo mx-3 ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  } ${modalIsOpen ? 'modal-open' : ''}`}
                  onClick={openModal}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              ) : (
                <button
                  disabled={uploadSuccess === false && beforeUpload}
                  className={`btn btn-success rounded-rairo mx-3 ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  } ${modalIsOpen ? 'modal-open' : ''}`}
                  onClick={() => {
                    openModal();
                  }}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              )}
            </>
          ) : (
            <form onSubmit={changeTitleMediaItem}>
              <input
                required
                className="rounded-rair form-control"
                onChange={onChangeTitle}
                value={titleValue}
              />
              <div className="mediaItem-group-btn">
                <button
                  disabled={disabledBtn}
                  className={`btn btn-success rounded-rairo ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  type="submit">
                  <i className="fas fa-check"></i>
                </button>
                <button
                  disabled={disabledBtn}
                  className={`btn btn-danger rounded-rairo mx-3 ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}
                  onClick={closeEdit}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {setUploadSuccess && (
        <PopUpChangeVideo
          modalIsOpen={modalIsOpen}
          item={item}
          closeModal={closeModal}
          setUploadSuccess={setUploadSuccess}
          beforeUpload={beforeUpload}
          mediaList={mediaList}
          setMediaList={setMediaList}
          index={index}
        />
      )}
    </MediaItemContainer>
  );
};

export default MediaItemChange;

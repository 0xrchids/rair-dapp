import React, { useEffect, useState, useRef } from "react";
// import { useHistory } from "react-router-dom";

import "./styles.css";

const ItemRank = (props) => {
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  // let history = useHistory();

  const rankRef = useRef();


  useEffect(() => {
    if (items.length === 0 && typeof props.items === "object") {
      setItems([...props.items]);
      setSelectedItem(props.items[0]);
      // console.log(props.selectedToken, 'items');
    }
  }, [props.items, items]);

  const dropDown = () => {
    setShowItems(!showItems);
  };
  // debugger

  const onSelectItem = (item) => {
    // props.selectItem(item.id);
    setSelectedItem(item);
    setShowItems(false);
  };


  const handleClickOutSideItemRank = (e) => {
    if (!rankRef.current.contains(e.target)) {
      setShowItems(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideItemRank);
    return () => document.removeEventListener('mousedown', handleClickOutSideItemRank);
  })

  return (
    <div ref={rankRef} className="item-rant--box">
      <div
        style={{ backgroundColor: `var(--${props.primaryColor})` }}
        className="item-rank--container"
      >
        <div className="select-box--selected-item">
          <span style={{ paddingRight: "10px" }}>{selectedItem?.pkey}</span>
          {items !== null ? (
            props.selectedToken ? (
              items.map((i) => {
                if (i.token === props.selectedToken) {
                  return <span key={i.id}>
                    {i.value}
                    {/* {i.token} */}
                  </span>;
                }
                return null;
              })
            ) : (
              <span>{selectedItem.value}</span>
            )
          ) : (
            "Need to select"
          )}
          {/* <span>{items !== null ? selectedItem.value : 'Need to select'}</span> */}
        </div>
        <div className="select-box--arrow" onClick={dropDown}>
          <span
            className={`${showItems ? "select-box--arrow-up" : "select-box--arrow-down"
              }`}
          />
        </div>

        <div
          style={{ display: showItems ? "block" : "none" }}
          className={"select-box--items items-rank"}
        >
          {items !== null &&
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item)
                  // props.handleClickToken(item.token)
                }}
                className={selectedItem === item ? "selected" : ""}
              >
                <span style={{ paddingRight: "10px" }}>{item.pkey}</span>
                <span>{item.value}</span>
                {/* <span>{item.token}</span> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ItemRank;

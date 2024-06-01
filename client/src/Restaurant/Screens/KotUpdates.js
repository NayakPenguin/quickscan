import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import LeftMenu from "../Components/LeftMenu";
import CloseIcon from '@material-ui/icons/Close';

import { db } from "../../firebase";
import { collection, onSnapshot, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const KotUpdates = () => {
    const [pageID, setPageID] = useState("kot-updates");

    const [allOrders, setAllOrders] = useState([]);
    const [idOrderCountMap, setIdOrderCountMap] = useState({});

    const [parts, setParts] = useState({ part1: [], part2: [], part3: [] });
    const [ordersInRow, setOrdersInRow] = useState(1);

    const [restaurantId, setRestaurantId] = useState("BrdwyKol");

    const ordersCollectionRef = collection(db, `Orders${restaurantId}`);
    const ordersNoCollectionRef = collection(db, `OrderNumbers${restaurantId}`);

    useEffect(() => {
        const getOrderNos = async () => {
            try {
                // Use onSnapshot to listen for real-time updates
                const unsubscribe = onSnapshot(ordersNoCollectionRef, (snapshot) => {
                    const idOrderCountMapLocal = {};

                    snapshot.docs.forEach((doc) => {
                        const { orderId, orderCount } = doc.data();
                        idOrderCountMapLocal[orderId] = orderCount;
                    });

                    console.log(idOrderCountMapLocal);
                    setIdOrderCountMap(idOrderCountMapLocal);
                });

                // Clean up the subscription when the component unmounts
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        };

        const getOrders = async () => {
            await getOrderNos();

            try {
                // Use onSnapshot to listen for real-time updates
                const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
                    const updatedData = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));

                    // Sort the data based on idOrderCountMap
                    updatedData.sort((a, b) => idOrderCountMap[a.id] - idOrderCountMap[b.id]);

                    console.log(updatedData);
                    setAllOrders(updatedData);
                });

                // Clean up the subscription when the component unmounts
                return () => unsubscribe();
            } catch (error) {
                console.log(error);
            }
        };

        getOrders();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            console.log("screenWidth : ", screenWidth);

            if (screenWidth > 1200) {
                setOrdersInRow(3);
            } else if (screenWidth > 760) {
                setOrdersInRow(2);
            } else {
                setOrdersInRow(1);
            }
        };

        window.addEventListener('resize', handleResize());

        return () => {
            window.removeEventListener('resize', handleResize());
        };
    }, []);

    useEffect(() => {
        const splitOrdersIntoParts = () => {
            const part1 = [];
            const part2 = [];
            const part3 = [];

            for (let i = 0; i < ordersInRow; i++) {
                const part = allOrders.filter((order, orderIndex) => idOrderCountMap[order.id] % ordersInRow === i);

                if (i === 0) {
                    part1.push(...part);
                } else if (i === 1) {
                    part2.push(...part);
                } else if (i === 2) {
                    part3.push(...part);
                }
            }

            setParts({ part1, part2, part3 });
        };

        splitOrdersIntoParts();
    }, [allOrders, ordersInRow, idOrderCountMap]);


    return (
        <Container>
            <LeftMenu pageID={pageID} />
            <Navbar />
            <h1>
                Pending KOTs
            </h1>
            <div className="all-bills">
                <div className="one-column">
                    {parts.part1.map((order, orderIndex) => (
                        <div className="bill-container" key={orderIndex}>
                            <div className="table">Table {idOrderCountMap[order.id]}</div>
                            <div className="order-detail">Order No. {idOrderCountMap[order.id]}</div>
                            {/* Mapping through orderDetails */}
                            {order.orderDetails.map((item, index) => (
                                <div className="order-item" key={index}>
                                    <div className="about-item">
                                        <div className="item-name">{item.itemName}</div>
                                        <div className="item-more">{item.extraWithItem}</div>
                                    </div>
                                    <div className="item-count">
                                        <CloseIcon />
                                        <div className="val">{item.count}</div>
                                    </div>
                                </div>
                            ))}
                            <div className="prepare-status">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                    />
                                    Payment Completed
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="one-column">
                    {parts.part2.map((order, orderIndex) => (
                        <div className="bill-container" key={orderIndex}>
                            <div className="table">Table {idOrderCountMap[order.id]}</div>
                            <div className="order-detail">Order No. {idOrderCountMap[order.id]}</div>

                            {/* Mapping through orderDetails */}
                            {order.orderDetails.map((item, index) => (
                                <div className="order-item" key={index}>
                                    <div className="about-item">
                                        <div className="item-name">{item.itemName}</div>
                                        <div className="item-more">{item.extraWithItem}</div>
                                    </div>
                                    <div className="item-count">
                                        <CloseIcon />
                                        <div className="val">{item.count}</div>
                                    </div>
                                </div>
                            ))}

                            <div className="prepare-status">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                    />
                                    Payment Completed
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="one-column">
                    {parts.part3.map((order, orderIndex) => (
                        <div className="bill-container" key={orderIndex}>
                            <div className="table">Table {idOrderCountMap[order.id]}</div>
                            <div className="order-detail">Order No. {idOrderCountMap[order.id]}</div>

                            {/* Mapping through orderDetails */}
                            {order.orderDetails.map((item, index) => (
                                <div className="order-item" key={index}>
                                    <div className="about-item">
                                        <div className="item-name">{item.itemName}</div>
                                        <div className="item-more">{item.extraWithItem}</div>
                                    </div>
                                    <div className="item-count">
                                        <CloseIcon />
                                        <div className="val">{item.count}</div>
                                    </div>
                                </div>
                            ))}

                            <div className="prepare-status">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                    />
                                    Payment Completed
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <h1>
                Completed KOTs
            </h1>

        </Container>
    )
}

export default KotUpdates

const Container = styled.div`
    background-color: #fff6e659;
    width: 100vw;
    min-height: 100vh;

    padding-left: 300px;
    padding-top: 100px;
    padding-right: 40px;

    position: relative;

    button{
        font-size: 0.75rem;
        padding: 5px 12.5px;
        border: none;
        background-color: #f2f2f2;
        border: 2px solid black;
        box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 10px 0px;
        
        &:hover{
            transition-duration: 250ms;
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.05) 1px 1px 10px 0px;
        }
    }

    h1{
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .all-bills{
        display: flex;
        justify-content: space-between;
        margin-bottom: 50px;
        
        .one-column{
            width: calc(33.33% - 6.66px);
            display: flex;
            flex-direction: column;
            
            .bill-container{
                width: 100%;
                background-color: white;
                overflow: hidden;
                border: 2.5px solid black;
                padding: 40px;
                margin-bottom: 10px;
                box-shadow: rgba(0, 0, 0, 0.20) 1px 1px 10px 0px;
    
                .done-img{
                    display: flex;
                    justify-content: center;
    
                    img{
                        height: 100px;
                        /* border: 1px solid black; */
                        margin-top: -20px;
                    }
                }
    
                .table{
                    font-size: 1.35rem;
                    font-weight: 600;
                    letter-spacing: 0.25rem;
                    text-transform: uppercase;
                    text-align: center;
                    color: #474747;
                    margin-bottom: 10px;
                }
    
                .order-placed{
                    font-size: 1.15rem;
                    font-weight: 600;
                    letter-spacing: 0.25rem;
                    text-transform: uppercase;
                    text-align: center;
                    /* color: #e5ae71; */
                    margin-bottom: 10px;
    
                    svg{
                        /* fill: #e5ae71; */
                    }
                }
    
                .order-detail{
                    font-size: 1rem;
                    font-weight: 500;
                    letter-spacing: 0.25rem;
                    text-transform: uppercase;
                    text-align: center;
                    color: #474747;
                    margin-bottom: 40px;
                }


                .prepare-status{
                    margin-top: 20px;
                    
                    label{
                        font-size: 0.8rem;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        -webkit-user-select: none; /* Safari */
                        -ms-user-select: none; /* IE 10 and IE 11 */
                        user-select: none; /* Standard syntax */
    
                        input{
                            margin-right: 5px;
                        }
                    }
                }

    
                .order-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #dadada;
    
                    .about-item{
                        .item-name{
                            font-size: 0.85rem;
                            font-weight: 500;
                            letter-spacing: 0.1rem;
        
                            span{
                                font-size: 0.85rem;
                                font-weight: 300;
                                letter-spacing: 0.1rem;
                            }
                        }
                        .item-more{
                            font-size: 0.7rem;
                            font-weight: 300;
                            letter-spacing: 0.03rem;
                            margin-top: 5px;
                        }
                    }
                    
                    .item-count{
                        margin: 0 0 0 15px;
                        display: flex;
                        align-items: center;
                        
                        svg{
                            font-size: 0.8rem;
                            letter-spacing: 0.1rem;
                            margin-right: 5px;
                        }
    
                        .val{
                            font-size: 1rem;
                            font-weight: 500;
                            margin-right: 10px;
                            letter-spacing: 0.1rem;
                        }
                    }
                }
    
                .total-price{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px 0;
                    border-bottom: 1px solid #dadada;
    
                    .left{
                        font-size: 0.95rem;
                        font-weight: 600;
                        letter-spacing: 0.1rem;
                    }
    
                    .right{
                        font-size: 1rem;
                        font-weight: 600;
                        letter-spacing: 0.1rem;
                    }
                }
    
                .place-order{
                    display: flex;
                    
                    .payment-btn{
                        color: #333;
                        text-decoration: none;
                        padding: 10px 20px;
                        background-color: #ebf0df;
                        font-size: 0.8rem;
                        font-weight: 500;
                        letter-spacing: 0.1rem;
                        border-radius: 5px;
                        white-space: nowrap;
                        
                        display: flex;
                        align-items: center;
    
                        svg{
                            font-size: 1rem;
                            margin: -3px 3px 0 0;
                        }
                    }
    
                    .download-btn{
                        color: #333;
                        text-decoration: none;
                        padding: 10px 20px;
                        background-color: whitesmoke;
                        font-size: 0.8rem;
                        font-weight: 500;
                        letter-spacing: 0.1rem;
                        border-radius: 5px;
                        margin-right: 10px;
                        white-space: nowrap;
                        margin-top: 25px;
                    }
                }
    
                .cancel-order{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /* margin-top: 20px; */
                    
                    .cancel-order-time-fill{
                        flex: 1;
                        background-color: whitesmoke;
                        border-radius: 100px;
                        height: 6px;
                        overflow: hidden;
    
                        .fill{
                            width: 60%;
                            background-color: orange;
                            height: 100%;
                        }
                    }
                    
                    .cancel-btn{
                        color: #fff;
                        text-decoration: none;
                        padding: 5px 10px;
                        background-color: #f96a6a;
                        font-size: 0.65rem;
                        font-weight: 500;
                        letter-spacing: 0.1rem;
                        border-radius: 5px;
                        margin-left: 10px;
                        
                        display: flex;
                        align-items: center;
                        text-align: center;
    
                        svg{
                            font-size: 1rem;
                            margin: -3px 3px 0 0;
                        }
                    }
                }
            }    
        }

    }        
`
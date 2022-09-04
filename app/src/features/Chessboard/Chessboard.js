import React, { useState, useEffect } from 'react';
import ChessBoard from '../../artifacts/ChessBoard.json';
import { store } from '../../app/store';
import { Move } from './chessAPI';
import Box from './Box';
import FastMenu from '../FastMenu/FastMenu';
import { ethers, signer } from '../../App';
import { changeTurnerListener } from '../../fun/chessboard'
import { formatAddress, formatPrice } from '../../fun/formatter';

export default function Chessboard() {   
        const [ content, setContent ] = useState('hidden');
        const [ State, setState ] = useState('');
        const [ Rotate, setRotate ] = useState('');

        store.subscribe(async ()=>{
            console.log(store.getState())
            if(store.getState().menu.matchmaking.message.status=='payed'&&store.getState().chess.lastMove.status!='nextmove'&&!store.getState().menu.matchmaking.team){
                setRotate('rotate-180');
            }
            if(store.getState().menu.matchmaking.message.status=='letsplaytg'){
                console.log("bene, ora c'è da giocare.")
                setContent('block')
            }
            if(store.getState().chess.lastMove.status=='nextmove'){
                setState('nextmove')
            }
            if(store.getState().chess.lastMove.status=='enemynextmove'){
                setState('enemynextmove')
                const chessboard = new ethers.Contract(store.getState().menu.matchmaking.chessboard, ChessBoard.abi, signer)
                if(chessboard.winner==store.getState().menu.matchmaking.enemy){
                    //Hai Perso.
                } 
            }
            if(store.getState().menu.status=='logout'){
                setState('logout')
            }
        })   
        useEffect(()=>{
            if(store.getState().chess.lastMove.status=='nextmove'){
                const chessboard = new ethers.Contract(store.getState().menu.matchmaking.chessboard, ChessBoard.abi, signer)
                if(chessboard.winner==store.getState().menu.user.ads){
                    //HAI VINTO.
                } else{
                    const turn = changeTurnerListener();
                    console.log('turn: '+turn)
                }  
               
            }
        });
        let x=-1;
        return(
            <div className={"Chess p-5 w-full inline-block rounded relative"}>
                <div className="FastMenu-container md:w-full xl:w-2/6 text-center md:block xl:inline-block">
                    <div className="FastMenu w-4/6 text-center relative xl:left-36 xl:bottom-56">
                        <FastMenu />
                    </div>
                </div>
                <div className="Chessboard_ w-4/6 inline-block text-left">
                    <div className="_Chessboard_ border-8 border-solid border-orange-800 bg-orange-700 px-10 py-2 rounded-md w-fit text-center">
                        <div className="Enemy rounded-full w-fit relative bg-orange-400 mb-2 p-2 border-2 border-solid border-orange-600 text-white font-semibold inline-block">{formatPrice(store.getState().menu.matchmaking.enemy)}</div>
                        <div 
                            className={"Chessboard relative border-8 border-solid border-orange-600 rounded-md "+Rotate}
                            id="Chessboard"    
                        >
                            {store.getState().chess.chessboard.map((col)=>{
                                let y = -1;
                                x++;     
                                return (
                                    <div key={String(y+x)} className={'Row-'+x}>
                                    {
                                        col.map((piece)=>{
                                            let className 
                                            if(piece.t) className=' text-white';
                                            else className=' text-black';
                                            y++; 
                                            return(<Box key={String(y)+String(x) } coo={String(y)+String(x) } p={piece.l} team={piece.t} color={className}/>);
                                        })
                                    }
                                    </div>
                                );
                            })}    
                        </div>

                        <div className="Player rounded-full w-fit relative bg-orange-400 mt-2 p-2 border-2 border-solid border-orange-600 text-white font-semibold inline-block">{formatPrice(store.getState().menu.user.ads)}</div>
        
                    </div>
                </div>
            </div>
        );
}
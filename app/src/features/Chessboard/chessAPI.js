import { signer, ethers, provider } from '../../App';
import { Moralis } from 'moralis'
import ChessBoard from '../../artifacts/ChessBoard';
import { store } from '../../app/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const useMenu = state=>state.memu;
export const Move = createAsyncThunk(
    "chess/move",
    async ( data ) => { 
        if(
            store.getState().chess.lastMove.firstStep!=''&&
            store.getState().chess.lastMove.secondStep==''&&
            store.getState().menu.matchmaking.chessboard!=''
        ){ 
            const chessboard = new ethers.Contract(store.getState().menu.matchmaking.chessboard, ChessBoard.abi, signer)
            console.log(chessboard)
            console.log('chessboard: ',chessboard.address)

            const x1 = store.getState().chess.lastMove.firstStep[0];const y1 = store.getState().chess.lastMove.firstStep[1];
            console.log(x1, y1);
            console.log(data.step[0], data.step[1])

            //Controlla che il turner sia uguale al tuo indirizzo
            const Turner = Moralis.Object.extend("Games");
            const query = new Moralis.Query(Turner);
            query
                .equalTo("chessboard",chessboard.address)
                .equalTo("turner",store.getState().menu.user.ads)
            const res = await query.find();
            
            console.log('res')
            console.log(res)
            
            if(res.length&&(String(data.step[0]+data.step[1])!=String(x1+y1))){
                const tx = await chessboard.connect(signer).Move(
                        [Number(x1),Number(y1)],
                        [Number(data.step[0]),Number(data.step[1])],
                        { gasLimit:1000000 }
                )
                
                //await tx.wait()
                console.log(tx)
                //Connettiti al DB e cambia lastFirstStep, lastSecondStep, e a turner metti l'indirizzo dell'avversario
                console.log('data.piece: '+data.piece)

                const par = {chessboard: chessboard.address, turner:store.getState().menu.matchmaking.enemy, x:String(x1+y1), y:String(data.step[0]+data.step[1]), piece:store.getState().chess.lastMove.piece, piece2:data.piece, team:data.team }
                const updated = await Moralis.Cloud.run("updateGame", par)
                console.log(updated)
            } else { console.log('Non è il tuo turno'); console.log(res); return {error:true} }
        } else if( store.getState().menu.matchmaking.chessboard=='' ) { console.log('Partita non deployata.'); return{error:true}; } 
        return {turner:store.getState().menu.matchmaking.enemy, data:data};
    }
) 
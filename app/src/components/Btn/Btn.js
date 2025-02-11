import React, { Component }  from 'react';

export default function Btn({ id, name, href, img, classes, current }) {
    return (
        <div className={"Btn inline-block mr-2 mt-2 p-1 text-slate-200 hover:text-slate-700 font-semibold mb-2"+classes}>
            <a className="" href={href}>{name}</a>
            <img className="" src={img}></img>
        </div>
    );
}
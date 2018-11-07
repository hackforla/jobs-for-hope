import React from 'react';
import './CompanyCard.scss';

const CompanyCard = ({ org }) => {
  return (
      <div className = "organization-card">
        <div className = "organization-card-content">
            <img id = "org-img" alt="company logod" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEXuNCX////tHwD97OruLh3xZl3uLBrzenT829nuMSHvRTjtDgDtIw3++fnuKBPvPS7zgnz+8/L95uXsAAD2paDydG3zfnf4tbH60M7zh4H3sKzycGnwTkP1l5LxYln2qaT5wr/0kIr71tTwVUrwXFLvQzb2npn6yMa7ZmYLAAADEElEQVR4nO3c7VLiMBSAYRprpSQtFET5UEFc3fu/w8VhxzJyaJOBmqS+z+9Opq9zaGkEBgMAAAAAAAAAAAAAAAAAAAAAAAAAAADgVKYy36fQqVzPp6869X0a3THviyRJpn9U7vtMupGp++Rgm5a+T6YDuVpXyZdX1btRNeNFcqxvo1oPaG07ML5P62pyvb45Cdx71j25cxyuoJKb2z6MqjSgtb/j2Ed1f4sXB7T2EfebnPMDejSq63hHtXlAa4tIR3U/oFV73cF9jKP6/RbfMqpzHdmoZsZuQGu7J+X7pB3sb/HWA1rbxDOqZuQyoLXqIY5HR9srqGQ/qsG/HF2uoJJVGfijo80tvlkxCfnRMVObC/s+Dd9CHdVLB7T2GOYuh9stvlmxDO+q6n6LbxbaLsf1BrS2zQIaVZdbfGHfGMzesdMt/kNN7BunL0GMauYwoJ+bFmX2aP8H2Y4DSFTWgf+f5nP1NrROfAjg3bhq2Yj5Uj/mpnppO6p38RQu3o+3KkpjOarRFFbfn+FtRzWWwo2wu51qm6tqHIW7kbxBUZbtoxpDYXV3dpMpV09toxpB4cY0nWPa9gYg+ML2HbSyXEVcaLW11DyqYReuSrvTa7qqhlw4dNg3y8y5UQ248Nnt0Uc9yW9vAy58cXy20/KLMeDCW8dCRaE/FNouQ6E/FNouQ6E/FNouQ6E/FNouQ6E/FNouQ6E/FNouQ6E/FNouQ6E/FNouQ6E/Pgozkbywy7HhFC4nEvFfXbl46HIcdGE+Fg9NxM8ylvKxI4dPk4VeKP/zlUIKKaSQQgoppJBCCimkkEIKKaSQQgoppLDXhcJZ534KS3NqJhfO1emhKhUPLbSwrNE+Cq2/OdyhjgunP5wjoJDChELvKKQwodA7CilMKPSOwgsLr/7bbu46fgJW+tRsJy6zngnHKvHQQjpUz3q1iyGt2699GgoppJBCCimkkEIKKaSQQgoppJDCX11oppWgcP3tyzObqNKvzv/0NyzFT8cY0+Uv/p9ZW/6WrNMS3colDode4VgAAAAAAACE4R9U3GY2mtEy/wAAAABJRU5ErkJggg==" />
            <h3 id ="org-title">{org.gsx$name.$t}</h3>
            <p id = "org-jobs-available"> 3 Jobs Available</p>
            <button id = "org-view-more-btn"> View More</button>
        </div>
      </div>
  )
}

export default CompanyCard;
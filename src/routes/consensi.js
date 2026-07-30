const express = require("express");
const router = express.Router();
const db = require("../database");

/*
 * Elenco consensi del paziente
 */
router.get("/paziente/:id", (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM consensi
            WHERE paziente_id=?
            ORDER BY created_at DESC
        `).all(req.params.id);

        res.json(rows);

    } catch(err){

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/*
 * Dettaglio consenso
 */
router.get("/:id", (req,res)=>{

    try{

        const consenso=db.prepare(`
            SELECT *
            FROM consensi
            WHERE id=?
        `).get(req.params.id);

        if(!consenso){

            return res.status(404).json({
                error:"Consenso non trovato"
            });

        }

        res.json(consenso);

    }catch(err){

        console.error(err);

        res.status(500).json({
            error:err.message
        });

    }

});


/*
 * Inserimento consenso
 */
router.post("/", (req,res)=>{

    try{

        const c=req.body;

        const result=db.prepare(`

            INSERT INTO consensi(

                paziente_id,

                tipo,

                testo,

                firmato,

                firmato_il,

                operatore,

                versione,

                created_at

            )

            VALUES(

                @paziente_id,

                @tipo,

                @testo,

                @firmato,

                @firmato_il,

                @operatore,

                @versione,

                datetime('now')

            )

        `).run({

            paziente_id:c.paziente_id,

            tipo:c.tipo,

            testo:c.testo,

            firmato:c.firmato ? 1 : 0,

            firmato_il:c.firmato ? c.firmato_il : null,

            operatore:c.operatore,

            versione:c.versione || 1

        });

        res.status(201).json({

            success:true,

            id:result.lastInsertRowid

        });

    }catch(err){

        console.error(err);

        res.status(500).json({

            error:err.message

        });

    }

});


/*
 * Firma consenso
 */
router.put("/:id/firma",(req,res)=>{

    try{

        db.prepare(`

            UPDATE consensi

            SET

                firmato=1,

                firmato_il=datetime('now'),

                operatore=@operatore

            WHERE id=@id

        `).run({

            id:req.params.id,

            operatore:req.body.operatore

        });

        res.json({

            success:true

        });

    }catch(err){

        console.error(err);

        res.status(500).json({

            error:err.message

        });

    }

});


/*
 * Elimina consenso
 */
router.delete("/:id",(req,res)=>{

    try{

        db.prepare(`

            DELETE FROM consensi

            WHERE id=?

        `).run(req.params.id);

        res.json({

            success:true

        });

    }catch(err){

        console.error(err);

        res.status(500).json({

            error:err.message

        });

    }

});

module.exports=router;
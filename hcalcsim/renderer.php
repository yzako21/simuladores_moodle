<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * hcalcsim Test question renderer class.
 *
 * @package    qtype
 * @subpackage hcalcsim
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * Generates the output for hcalcsim Test questions.
 *
 * @copyright  2016 Moguel Pedraza Francisco Isaac / UNAM-DGTIC
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_hcalcsim_renderer extends qtype_renderer {
    public function formulation_and_controls(question_attempt $qa,
            question_display_options $options) {

        global $CFG;
        global $DB;

        $question = $qa->get_question();
        $currentanswer = $qa->get_last_qt_var('answer');

        $inputname = $qa->get_qt_field_name('answer');
        $inputattributes = array(
            'type' => 'text',
            'name' => $inputname,
            'value' => $currentanswer,
            'id' => $inputname,
            'size' => 80,
        );

        //extraer el id de la pregunta para unirlo a la respuesta
        $generalid =explode("_", $inputname);
        $generalid = str_replace(":", "_", $generalid[0]);


        if ($options->readonly) {
            $inputattributes['readonly'] = 'readonly';
        }

        $feedbackimg = '';
        if ($options->correctness) {
            $answer = $question->get_matching_answer(array('answer' => $currentanswer));
            if ($answer) {
                $fraction = $answer->fraction;
            } else {
                $fraction = 0;
            }
            $inputattributes['class'] = $this->feedback_class($fraction);
            $feedbackimg = $this->feedback_image($fraction);
        }

        $questiontext = $question->format_questiontext($qa);
        $placeholder = false;
        if (preg_match('/_____+/', $questiontext, $matches)) {
            $placeholder = $matches[0];
            $inputattributes['size'] = round(strlen($placeholder) * 1.1);
        }
        $input = html_writer::empty_tag('input', $inputattributes) . $feedbackimg;

        if ($placeholder) {
            $inputinplace = html_writer::tag('label', get_string('answer'),
                    array('for' => $inputattributes['id'], 'class' => 'accesshide'));
            $inputinplace .= $input;
            $questiontext = substr_replace($questiontext, $inputinplace,
                    strpos($questiontext, $placeholder), strlen($placeholder));
        }

        $result = html_writer::tag('div', $questiontext, array('class' => 'qtext'));

        if (!$placeholder) {
            $result .= html_writer::start_tag('div', array('class' => 'ablock'));            

            /*
                var_dump( $inputattributes['type']);
                echo "<br>";
                var_dump( $inputattributes['name']);
                echo "<br>";
                var_dump( $inputattributes['value']);
                echo "<br>";
                var_dump( $inputattributes['id']);
                echo "<br>";
                var_dump( $inputattributes['size']);
            */

            $result .= ' 
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery-1.8.3.min.js"/></script>
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery-ui.min.js"/></script>                
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet.js"/> </script>
                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet/plugins/jquery.sheet.dts.js"/> </script>    


                



                <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/rediz.js"/> </script>  

                <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/jquery-ui.min.css"/>            
                <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/jquery.sheet.css"/>                  
                <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/base.css"/>

                <!--
                    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/rediz.js"/></script>
                    <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/base.css"/>
                -->  
                

                ';

            $result .= '   
                            
                    <div class="felement rAdded" index_sheet="0" moodleId="'.$generalid.'">
                        <div class="inlineMenu" style="">
                                    <div>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila despues de selección">
                                            <img alt="Insertar fila despues de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addnextR.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección">
                                            <img alt="Insertar fila antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addprevR.png">
                                        </p>
                                        
                                        <!--p onclick="jQuery.sheet.instance[0].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas">
                                            <img alt="Agregar multiples filas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_add_multi.png">
                                        </p-->
                                        <p onclick="jQuery.sheet.instance[0].deleteRow(); return false;" title="Borrar fila">
                                            <img alt="Borrar fila" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_delete.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1],false); return false;" title="Insertar columna despues de selección">
                                            <img alt="Insertar columna despues de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_A.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección">
                                            <img alt="Insertar columna antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B.png">
                                        </p>                                        
                                        <!--p onclick="jQuery.sheet.instance[0].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas">
                                            <img alt="Insertar multiples columnas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_add_multi.png">
                                        </p-->
                                        <p onclick="jQuery.sheet.instance[0].deleteColumn(); return false;" title="Borrar columna">
                                            <img alt="Borrar columna" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_delete.png">
                                        </p>                                        
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleBold\'); return false;" title="Bold">
                                            <img alt="Bold" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_bold.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleItalics\'); return false;" title="Italica">
                                            <img alt="Italica" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_italic.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado">
                                            <img alt="Subrayado" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_underline.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar">
                                            <img alt="Tachar" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_strikethrough.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda">
                                            <img alt="Alinear izquierda" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_left.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleCenter\', \'styleLeft styleRight\'); return false;" title="Alinear al centro">
                                            <img alt="Alinear al centro" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_center.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellStyleToggle(\'styleRight\', \'styleLeft styleCenter\'); return false;" title="Alinear derecha">
                                            <img alt="Alinear derecha" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_right.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellUndoable.undoOrRedo(true); return false;" title="Deshacer">
                                            <img alt="Deshacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Undo.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].cellUndoable.undoOrRedo(false); return false;" title="Rehacer">
                                            <img alt="Rehacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Redo.png">
                                        </p>

                                        <p onclick="jQuery.sheet.instance[0].merge(); return false;" title="Unir celdas">
                                            <img alt="Unir celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/merge_cells_icon.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].unmerge(); return false;" title="Separar celdas">
                                            <img alt="Separar celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/unmerge_cells_icon.png">
                                        </p>

                                        <p onclick="jQuery.sheet.instance[0].sort(); return false" title="Orden ascendente ">
                                            <img alt="Orden ascendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaA-Z.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].sort(true); return false" title="Orden descendente">
                                            <img alt="Orden descendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaZ-A.png">
                                        </p>
                                    </div>
                                </div>

                        <br class=cBoth"">

                        <div class="sheet sheetParent answerView preguntaSim" moodleId="'.$generalid.'"> 
                            <table title="Hoja 1">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr><td></td><td></td><td></td><td></td><td></td></tr>
                            </table>
                        </div>                                         
                    </div>

                    <div class="w100">                        
                        <a href="#" id="" moodleId="'.$generalid.'" class="w40 resDefault hcalcbutton">Cargar valores de inicio</a>                        
                        <a href="#" id="" moodleId="'.$generalid.'" class="w40 answerGenerate hcalcbutton">Guardar</a>
                    </div>     

                    <br><br>                 

                  ';

            $result .= html_writer::tag('span', $input, array('class' => 'answer'));


            $result .= html_writer::end_tag('div');

        }

        if ($qa->get_state() == question_state::$invalid) {
            $result .= html_writer::nonempty_tag('div',
                    $question->get_validation_error(array('answer' => $currentanswer)),
                    array('class' => 'validationerror'));
        }

        //echo $question->initsim;

        $redizVar = '<script type="text/javascript">

            var questionDataSheet
            ,   jsonLoad_ini
            ,   restSim
            ;

            var render = true;

            var rootDir = "'.$CFG->wwwroot.'";
            var answerId
            ,   answerString = ""
            ;

            //variables para almacenar los dos estados de respuesta (inicial/final)
            var iniAnswer
            ,   resAnswer
            ;

            var currentMoodleId;

            $.sheet.preLoad("'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet/");
            $(function(){                                  

                   console.warn("carga la hoja de calculo en el render");

                   console.log($.sheet.dts);

                   questionDataSheet = \''.$question->initsim.'\';               
                   //questionId = "'.str_replace([":","_answer"], ["_",""], $inputattributes["id"] ).'";                     
                   //answerId = "'.$inputattributes["id"].'";
                   restSim = "'.$question->restsim.'";

                   currentMoodleId = "'.str_replace([":","_answer"], ["_",""], $inputattributes["id"] ).'";

                   $(\'.resDefault.hcalcbutton[moodleid="'.str_replace([":","_answer"], ["_",""], $inputattributes["id"] ).'"\').attr("restore",\''.$question->initsim.'\');
                    
                    jsonLoad_ini = jQuery.parseJSON(String(questionDataSheet));
                    console.log(Array(jsonLoad_ini));
                    tables_ini = $.sheet.dts.toTables.json(jsonLoad_ini);
                    ;  
                    $(".preguntaSim[moodleid=\''.str_replace([":","_answer"], ["_",""], $inputattributes["id"] ).'\']").html(tables_ini).sheet(); 
                    initEventshcalsim();
               
                //questionDataSheet = "";
            }); 

            
        </script>';        
        

        $result .= $redizVar;

        return $result;
    }

    public function specific_feedback(question_attempt $qa) {
        $question = $qa->get_question();

        $answer = $question->get_matching_answer(array('answer' => $qa->get_last_qt_var('answer')));
        if (!$answer || !$answer->feedback) {
            return '';
        }

        return $question->format_text($answer->feedback, $answer->feedbackformat,
                $qa, 'question', 'answerfeedback', $answer->id);
    }

    public function correct_response(question_attempt $qa) {
        $question = $qa->get_question();

        $answer = $question->get_matching_answer($question->get_correct_response());
        if (!$answer) {
            return '';
        }

        return get_string('correctansweris', 'qtype_hcalcsim',
                s($question->clean_response($answer->answer)));
    }
}

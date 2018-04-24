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
 * Defines the editing form for the hcalcsim question type.
 *
 * @package    qtype
 * @subpackage hcalcsim
 * @copyright  2007 Jamie Pratt
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * hcalcsim Test question editing form definition.
 *
 * @copyright  2016 Moguel Pedraza Francisco Isaac
 */

class qtype_hcalcsim_edit_form extends question_edit_form {

    protected function defaultsims(){
            global $CFG;
            global $DB;

            $htmlSim = '
                <script class="initSim" type="text/javascript">

                    //variable para almacenar el simulador inicial
                    var jsonLoad_ini;
                    var answerString;
                    var answPrev = "";
                    var dataImage ="";
                    var render = false;

                    var rootDir = "'.$CFG->wwwroot.'";


                    $.sheet.preLoad("'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet/");
                    $(function(){

                        $(".sheetParent").sheet({
                        });

                        alert("Recuerda tener espacios vacios para respuestas antes de modificar una tabla y guardar una nueva respuesta.");


                        inithcalsim();
                    });
                </script>

                <div id="" class=" fitem initSView">

                    <div class="fitemtitle">
                        <label for="id_defaultmark"> <b>Vista inicial de la tabla</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
                    </div>

                            <div class="felement rAdded"  index_sheet="0">
                                <div class="inlineMenu w100" style="">
                                    <div>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila después de selección">
                                            <img alt="Insertar fila después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addnextR.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección">
                                            <img alt="Insertar fila antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addprevR.png">
                                        </p>

                                        <!--<p onclick="jQuery.sheet.instance[0].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas">
                                            <img alt="Agregar multiples filas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_add_multi.png">
                                        </p>-->
                                        <p onclick="jQuery.sheet.instance[0].deleteRow(); return false;" title="Borrar fila">
                                            <img alt="Borrar fila" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_delete.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1],false); return false;" title="Insertar columna después de selección">
                                            <img alt="Insertar columna después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_A.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección">
                                            <img alt="Insertar columna antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B.png">
                                        </p>

                                        <!--<p onclick="jQuery.sheet.instance[0].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas">
                                            <img alt="Insertar multiples columnas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B_multi.png">
                                        </p>-->
                                        <p onclick="jQuery.sheet.instance[0].deleteColumn(); return false;" title="Borrar columna">
                                            <img alt="Borrar columna" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_delete.png">
                                        </p>
                                        <!--<p onclick="jQuery.sheet.instance[0].getTdRange(null, jQuery.sheet.instance[0].obj.formula().val()); return false;" title="Obtener rango de celdas">
                                            <img alt="Obtener rango de celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_get_range.png">
                                        </p>-->
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


                                        <p onclick="jQuery.sheet.instance[0].sort(true); return false" title="Orden ascendente ">
                                            <img alt="Orden ascendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaA-Z.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].sort(); return false" title="Orden descendente">
                                            <img alt="Orden descendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaZ-A.png">
                                        </p>


                                    </div>
                                </div>
                                <br class=cBoth"">

                                <div class="general" style="margin-top: -33px;"">
                                    <div class="sheet sheetParent" id="initsim" title="Hoja de prellenado" style="width:100%">
                                        <table title="Hoja 1">
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
                                <div id="formatCont_ini" class="w100">
                                <div class="w30">
                                    <p href="#" id="bDuplica">Guardar Vista inicial de la tabla</p>
                                </div>

                                <div class="w100" id="tmpJsonC">
                                </div>
                            </div>
                            </div>


                </div>

                <div id="" class=" fitem">
                  <div class="fitemtitle">
                    <label for="id_defaultmark"> <b>Generador de respuestas</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
                </div>
                <div class="felement rAdded" id="simressheet" index_sheet="1">
                    <div class="inlineMenu w100" style="">
                        <div>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addRow(tdSelected[0], false); return false;" title="Insertar fila después de selección">
                                <img alt="Insertar fila después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addnextR.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección">
                                <img alt="Insertar fila antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addprevR.png">
                            </p>
                            <!--<p onclick="jQuery.sheet.instance[1].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas">
                                <img alt="Agregar multiples filas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_add_multi.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].deleteRow(); return false;" title="Borrar fila">
                                <img alt="Borrar fila" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_delete.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addColumn(tdSelected[1], false); return false;" title="Insertar columna después de selección">
                                <img alt="Insertar columna después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_A.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección">
                                <img alt="Insertar columna antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B.png">
                            </p>
                            <!--<p onclick="jQuery.sheet.instance[1].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas">
                                <img alt="Insertar multiples columnas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B_multi.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].deleteColumn(); return false;" title="Borrar columna">
                                <img alt="Borrar columna" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_delete.png">
                            </p>
                            <!--<p onclick="jQuery.sheet.instance[1].getTdRange(null, jQuery.sheet.instance[1].obj.formula().val()); return false;" title="Obtener rango de celdas">
                                <img alt="Obtener rango de celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_get_range.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleBold\'); return false;" title="Bold">
                                <img alt="Bold" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_bold.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleItalics\'); return false;" title="Italica">
                                <img alt="Italica" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_italic.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado">
                                <img alt="Subrayado" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_underline.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar">
                                <img alt="Tachar" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_strikethrough.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda">
                                <img alt="Alinear izquierda" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_left.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle("styleCenter", \'styleLeft styleRight\'); return false;" title="Alinear al centro">
                                <img alt="Alinear al centro" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_center.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle("styleRight", \'styleLeft styleCenter\'); return false;" title="Alinear derecha">
                                <img alt="Alinear derecha" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_right.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellUndoable.undoOrRedo(true); return false;" title="Deshacer">
                                <img alt="Deshacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Undo.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellUndoable.undoOrRedo(false); return false;" title="Rehacer">
                                <img alt="Rehacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Redo.png">
                            </p>

                            <p onclick="jQuery.sheet.instance[1].merge(); return false;" title="Unir celdas">
                                <img alt="Unir celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/merge_cells_icon.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].unmerge(); return false;" title="Separar celdas">
                                <img alt="Separar celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/unmerge_cells_icon.png">
                            </p>


                            <p onclick="jQuery.sheet.instance[1].sort(true); return false" title="Orden ascendente ">
                                <img alt="Orden ascendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaA-Z.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].sort(); return false" title="Orden descendente">
                                <img alt="Orden descendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaZ-A.png">
                            </p>

                        </div>
                    </div>

                    <br class=cBoth"">

                    <div class="general" style="margin-top: -33px;"">
                      <div id="resultsim" class="sheet sheetParent" title="Hoja de Respuestas">
                        <table title="Hoja 1">
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

                    <div id="formatCont" class="w100">

                        <br class="cBoth">

                        <div class="w100" id="prevAns">
                            <p><b>Vista de respuestas previas</b></p>
                            <div id="contPrevAnsw" class="w100">

                            </div>
                            <div id="popUp">
                                <div>
                                    <img id="imagePopC" src="" alt="Imagen previa de pregunta">
                                </div>
                                <br>
                                <p class="closePop">Regresar</p>
                            </div>
                        </div>

                        <!--
                            <div id="rGeneradas" class="w70">
                                <h5  class="">Respuestas generdadas:</h5>
                                <div class="" id="rCont">
                                </div>
                            </div>
                        -->

                        <!--
                            <div class="w100">
                                <br><br>
                                <div class="general" style="margin-top: -33px;"">
                                  <div class="sheet" id="sheetLoaded" title="Hoja de Respuestas Prellenada">
                                    <table title="Hoja 1">
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
                            </div>
                        -->
                    </div>
                  </div>
                </div>

                <div class="w100">
                    <div class="w70" id="descRes">
                        <p class="w30"><b>Descripción: </b></p>
                        <div class="w60">
                            <p class="w30"><b>Calificación: </b></p>
                            <select name="" id="answCal">
                                <option value="0.0" selected="selected">Ninguno(a)</option>
                                <option value="1.0">100%</option>
                                <option value="0.9">90%</option>
                                <option value="0.8333333">83.33333%</option>
                                <option value="0.8">80%</option>
                                <option value="0.75">75%</option>
                                <option value="0.7">70%</option>
                                <option value="0.6666667">66.66667%</option>
                                <option value="0.6">60%</option>
                                <option value="0.5">50%</option>
                                <option value="0.4">40%</option>
                                <option value="0.3333333">33.33333%</option>
                                <option value="0.3">30%</option>
                                <option value="0.25">25%</option>
                                <option value="0.2">20%</option>
                                <option value="0.1666667">16.66667%</option>
                                <option value="0.1428571">14.28571%</option>
                                <option value="0.125">12.5%</option>
                                <option value="0.1111111">11.11111%</option>
                                <option value="0.1">10%</option>
                                <option value="0.05">5%</option>
                            </select>
                        </div>
                        <input class="w90" id="answDes" value="Sin descripción" type="text" >
                        <p id="bResult" class="w40">Guardar una nueva respuesta</p>
                        <p id="" class="w40 resDefaultForm hcalcbutton">Cargar valores de inicio</p>
                        <br class="cBoth">

                        <div class="w100" id="tmpJsonC2">

                        </div>

                    </div>
                </div>
            ';

            return $htmlSim;
    }
    protected function restartsims(){
            global $CFG;
            global $DB;

            /*
                echo "<h3>Initsim</h3>";
                var_dump($this->question->options->initsim);

                echo "<h3>resultSim</h3>";
                var_dump($this->question->options->resultsim);
                echo "<hr><hr>";
            */

            //recuperar las respuestas para usarlas en el javaScript
            $prevAnsw = json_encode($this->question->options->answers);

            $htmlSim = '

                <script class="restartSim" type="text/javascript">
                    var jsonLoad_ini;
                    var restSim;
                    var answerString;
                    var answPrev;
                    var dataImage;

                    var iniString;
                    var resString;

                    var render = false;

                    var answers;

                    var rootDir = "'.$CFG->wwwroot.'";

                    $.sheet.preLoad("'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet/");
                    $(function(){
                        //$(".sheetParent").sheet({
                        //});

                        alert("Recuerda tener espacios vacios para respuestas antes de modificar una tabla y guardar una nueva respuesta.");

                        //Se carga un JSON con las respuestas actuales
                        answers = jsonaAnsw2Array($.parseJSON(""+\''.$prevAnsw.'\'+""));

                        restSim = "'.$this->question->options->restsim.'";

                        answPrev = "'.$this->question->options->answprev.'";

                        iniString = \''.$this->question->options->initsim.'\';
                        resString = \''.$this->question->options->resultsim.'\';

                        console.log(answPrev);

                        restoreSheets(iniString, resString);
                        restorePrevAnsw(answPrev);
                        inithcalsim();
                    });
                </script>

                <div id="" class=" fitem initSView">

                    <div class="fitemtitle">
                        <label for="id_defaultmark"> <b>Vista inicial de la tabla</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
                    </div>

                            <div class="felement rAdded" index_sheet="0">
                                <div class="inlineMenu w100" style="">
                                    <div>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila después de selección">
                                            <img alt="Insertar fila después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addnextR.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección">
                                            <img alt="Insertar fila antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addprevR.png">
                                        </p>

                                        <!--<p onclick="jQuery.sheet.instance[0].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas">
                                            <img alt="Agregar multiples filas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_add_multi.png">
                                        </p>-->
                                        <p onclick="jQuery.sheet.instance[0].deleteRow(); return false;" title="Borrar fila">
                                            <img alt="Borrar fila" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_delete.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1], false); return false;" title="Insertar columna después de selección">
                                            <img alt="Insertar columna después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_A.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección">
                                            <img alt="Insertar columna antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B.png">
                                        </p>

                                        <!--<p onclick="jQuery.sheet.instance[0].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas">
                                            <img alt="Insertar multiples columnas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B_multi.png">
                                        </p>-->
                                        <p onclick="jQuery.sheet.instance[0].deleteColumn(); return false;" title="Borrar columna">
                                            <img alt="Borrar columna" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_delete.png">
                                        </p>
                                        <!--<p onclick="jQuery.sheet.instance[0].getTdRange(null, jQuery.sheet.instance[0].obj.formula().val()); return false;" title="Obtener rango de celdas">
                                            <img alt="Obtener rango de celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_get_range.png">
                                        </p>-->
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


                                        <p onclick="jQuery.sheet.instance[0].sort(true); return false" title="Orden ascendente ">
                                            <img alt="Orden ascendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaA-Z.png">
                                        </p>
                                        <p onclick="jQuery.sheet.instance[0].sort(); return false" title="Orden descendente">
                                            <img alt="Orden descendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaZ-A.png">
                                        </p>

                                    </div>
                                </div>

                                <br class=cBoth"">

                                <div class="general" style="margin-top: -33px;"">
                                    <div class="sheet sheetParent" id="initsim" title="Hoja de prellenado" style="width:100%">
                                        <table title="Hoja 1">
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

                                <div id="formatCont_ini" class="w100">
                                    <div class="w30">
                                        <p href="#" id="bDuplica">Guardar Vista inicial de la tabla</p>
                                    </div>

                                    <div class="w100" id="tmpJsonC">
                                    </div>
                                </div>
                            </div>
                </div>

                <div id="" class=" fitem">
                  <div class="fitemtitle">
                    <label for="id_defaultmark"> <b>Generador de respuestas</b> <img class="req" title="Campo requerido" alt="Campo requerido" src="'.$CFG->wwwroot.'/theme/image.php/clean/core/1462210203/req"></label>
                  </div>
                  <div class="felement rAdded" id="simressheet" index_sheet="1">
                    <div class="inlineMenu w100" style="">
                        <div>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addRow(tdSelected[0], false); return false;" title="Insertar fila después de selección">
                                <img alt="Insertar fila después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addnextR.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección">
                                <img alt="Insertar fila antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/addprevR.png">
                            </p>
                            <!--<p onclick="jQuery.sheet.instance[1].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas">
                                <img alt="Agregar multiples filas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_add_multi.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].deleteRow(); return false;" title="Borrar fila">
                                <img alt="Borrar fila" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_row_delete.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addColumn(tdSelected[1], false); return false;" title="Insertar columna después de selección">
                                <img alt="Insertar columna después de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_A.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección">
                                <img alt="Insertar columna antes de selección" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B.png">
                            </p>

                            <!--<p onclick="jQuery.sheet.instance[1].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas">
                                <img alt="Insertar multiples columnas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/InsertC_B_multi.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].deleteColumn(); return false;" title="Borrar columna">
                                <img alt="Borrar columna" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_col_delete.png">
                            </p>
                            <!--<p onclick="jQuery.sheet.instance[1].getTdRange(null, jQuery.sheet.instance[1].obj.formula().val()); return false;" title="Obtener rango de celdas">
                                <img alt="Obtener rango de celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/sheet_get_range.png">
                            </p>-->
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleBold\'); return false;" title="Bold">
                                <img alt="Bold" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_bold.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleItalics\'); return false;" title="Italica">
                                <img alt="Italica" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_italic.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado">
                                <img alt="Subrayado" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_underline.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar">
                                <img alt="Tachar" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_strikethrough.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda">
                                <img alt="Alinear izquierda" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_left.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle("styleCenter", \'styleLeft styleRight\'); return false;" title="Alinear al centro">
                                <img alt="Alinear al centro" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_center.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellStyleToggle("styleRight", \'styleLeft styleCenter\'); return false;" title="Alinear derecha">
                                <img alt="Alinear derecha" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/text_align_right.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellUndoable.undoOrRedo(true); return false;" title="Deshacer">
                                <img alt="Deshacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Undo.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].cellUndoable.undoOrRedo(false); return false;" title="Rehacer">
                                <img alt="Rehacer" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/Redo.png">
                            </p>

                            <p onclick="jQuery.sheet.instance[1].merge(); return false;" title="Unir celdas">
                                <img alt="Unir celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/merge_cells_icon.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].unmerge(); return false;" title="Separar celdas">
                                <img alt="Separar celdas" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/unmerge_cells_icon.png">
                            </p>


                            <p onclick="jQuery.sheet.instance[1].sort(true); return false" title="Orden ascendente ">
                                <img alt="Orden ascendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaA-Z.png">
                            </p>
                            <p onclick="jQuery.sheet.instance[1].sort(); return false" title="Orden descendente">
                                <img alt="Orden descendente" src="'.$CFG->wwwroot.'/question/type/hcalcsim/img/OrdenaZ-A.png">
                            </p>

                        </div>
                    </div>

                    <br class=cBoth"">

                    <div class="general" style="margin-top: -33px;"">
                      <div id="resultsim" class="sheet sheetParent" title="Hoja de Respuestas">
                        <table title="Hoja 1">
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

                    <div id="formatCont" class="w100">

                        <br class="cBoth">

                        <div class="w100" id="prevAns">
                            <p><b>Vista de respuestas previas</b></p>
                            <div id="contPrevAnsw" class="w100">

                            </div>
                            <div id="popUp">
                                <div>
                                    <img id="imagePopC" src="" alt="Imagen previa de pregunta">
                                </div>
                                <br>
                                <p class="closePop">Regresar</p>
                            </div>
                        </div>

                        <!--
                            <div id="rGeneradas" class="w70">
                                <h5  class="">Respuestas generdadas:</h5>
                                <div class="" id="rCont">
                                </div>
                            </div>
                        -->
                        <!--
                            <div class="w100">
                                <br><br>
                                <div class="general" style="margin-top: -33px;"">
                                  <div class="sheet" id="sheetLoaded" title="Hoja de Respuestas Prellenada">
                                    <table title="Hoja 1">
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
                            </div>
                        -->
                    </div>
                  </div>


                </div>

                <div class="w100">
                    <div class="w70" id="descRes">
                        <p class="w30"><b>Descripción: </b></p>
                        <div class="w60">
                            <p class="w30"><b>Calificación: </b></p>
                            <select name="" id="answCal">
                                <option value="0.0" selected="selected">Ninguno(a)</option>
                                <option value="1.0">100%</option>
                                <option value="0.9">90%</option>
                                <option value="0.8333333">83.33333%</option>
                                <option value="0.8">80%</option>
                                <option value="0.75">75%</option>
                                <option value="0.7">70%</option>
                                <option value="0.6666667">66.66667%</option>
                                <option value="0.6">60%</option>
                                <option value="0.5">50%</option>
                                <option value="0.4">40%</option>
                                <option value="0.3333333">33.33333%</option>
                                <option value="0.3">30%</option>
                                <option value="0.25">25%</option>
                                <option value="0.2">20%</option>
                                <option value="0.1666667">16.66667%</option>
                                <option value="0.1428571">14.28571%</option>
                                <option value="0.125">12.5%</option>
                                <option value="0.1111111">11.11111%</option>
                                <option value="0.1">10%</option>
                                <option value="0.05">5%</option>
                            </select>
                        </div>
                        <input class="w90" id="answDes" value="Sin descripción" type="text" >
                        <p id="bResult" class="w40">Guardar una nueva respuesta</p>
                        <br class="cBoth">

                        <div class="w100" id="tmpJsonC2">

                        </div>
                    </div>
                </div>
            ';

            return $htmlSim;
    }

    protected function definition_inner($mform) {
        global $CFG;
        global $DB;



        //var_dump($this->question->options->answers);

        /*
            -IS
            BANDERAS PARA LA CARGA DEL SIMULADOR INICIAL Y SIULADOR RESULTADO
        */
        $mform->addElement('text', 'initsim',"");
        $mform->setType('initsim', PARAM_NOTAGS);     //Set type of element
        $mform->setDefault('initsim', '[{"title":"Hoja 1","rows":[{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]}],"metadata":{"widths":["120px","120px","120px","120px","120px"],"frozenAt":{"row":0,"col":0}}}]');          //Default value

        $mform->addElement('text', 'resultsim',"");
        $mform->setType('resultsim', PARAM_NOTAGS);   //Set type of element
        $mform->setDefault('resultsim', '[{"title":"Hoja 1","rows":[{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]}],"metadata":{"widths":["120px","120px","120px","120px","120px"],"frozenAt":{"row":0,"col":0}}}]');        //Default value

        $mform->addElement('text', 'restsim',"");
        $mform->setType('restsim', PARAM_NOTAGS);   //Set type of element
        $mform->setDefault('restsim', '<->');        //Default value

        $mform->addElement('text', 'answprev',"");
        $mform->setType('answprev', PARAM_NOTAGS);   //Set type of element
        $mform->setDefault('answprev', '');        //Default value

        $mform->addElement('html','
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery-1.8.3.min.js"/></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery-ui.min.js"/></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.sheet.js"/> </script>

            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/jquery.bpopup.min.js"/> </script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/html2canvas.js"/> </script>

            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/hcalcsim/js/rediz.js"/> </script>

            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/jquery-ui.min.css"/>
            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/jquery.sheet.css"/>
            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/hcalcsim/css/base.css"/>
        ');
        /*-ISE*/

        //add scripts

        if (!isset($this->question->options)){
            global $CFG;
            global $DB;
            $OpVar ="";
        }else{
            global $CFG;
            global $DB;
            $OpVar = $this->question->options->initsim;
        }

        if ($OpVar == "" || $OpVar == '[{"title":"Hoja 1","rows":[{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]}],"metadata":{"widths":["120px","120px","120px","120px","120px"],"frozenAt":{"row":0,"col":0}}}]'){
            $mform->addElement('html',$this->defaultsims());
        }
        else{
            $mform->addElement('html',$this->restartsims());
        }

        $menu = array(
            get_string('caseno', 'qtype_hcalcsim'),
            get_string('caseyes', 'qtype_hcalcsim')
        );
        //$mform->addElement('select', 'usecase',
        //      get_string('casesensitive', 'qtype_hcalcsim'), $menu);
        $mform->addElement('static', 'answersinstruct',
                get_string('correctanswers', 'qtype_hcalcsim'),
                get_string('filloutoneanswer', 'qtype_hcalcsim'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_hcalcsim', '{no}'),
                question_bank::fraction_options());

        $this->add_interactive_settings();
        }

    protected function get_more_choices_string() {

        return get_string('addmoreanswerblanks', 'qtype_hcalcsim');
    }

    protected function data_preprocessing($question) {
      $question = parent::data_preprocessing($question);
    $question = $this->data_preprocessing_answers($question);
    $question = $this->data_preprocessing_hints($question);

      return $question;
    }

    public function validation($data, $files) {
        $errors = parent::validation($data, $files);
        $answers = $data['answer'];
        $answercount = 0;
        $maxgrade = false;
        foreach ($answers as $key => $answer) {
            $trimmedanswer = trim($answer);
            if ($trimmedanswer !== '') {
                $answercount++;
                if ($data['fraction'][$key] == 1) {
                    $maxgrade = true;
                }
            } else if ($data['fraction'][$key] != 0 ||
                    !html_is_blank($data['feedback'][$key]['text'])) {
                $errors["answeroptions[$key]"] = get_string('answermustbegiven', 'qtype_hcalcsim');
                $answercount++;
            }
        }
        if ($answercount==0) {
            $errors['answeroptions[0]'] = get_string('notenoughanswers', 'qtype_hcalcsim', 1);
        }
        if ($maxgrade == false) {
            $errors['answeroptions[0]'] = get_string('fractionsnomax', 'question');
        }
        return $errors;
    }

    public function qtype() {

        return 'hcalcsim';
    }
}

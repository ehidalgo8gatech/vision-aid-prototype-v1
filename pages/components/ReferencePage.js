import { Modal as ReactModal, Button } from 'react-bootstrap';
import { useState } from "react";

const renderReferencePage = () => {
    return (
        <table border="1" className="table beneficiary-table table-bordered">
            <thead>
            <tr>
                <th>S.no</th>
                <th>Programs</th>
                <th>Types</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>Screening / Out reach activities / Camp</td>
                <td>Low Vision Screening</td>
                <td>Low vision screening of the school of the blind and Identification of the visually impaired for assistive technology</td>
            </tr>
            <tr>
                <td>2</td>
                <td></td>
                <td>Identification of MDVI</td>
                <td>Beneficiaries come under Multiple disabilities and vision impairment.</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Functional Vision / Early Intervention / Vision enhancement</td>
                <td></td>
                <td>Age group less than 7 years. Training of infants, children and parents to improve the brain’s ability to use and interpret visual information especially in kids with Cortical visual impairment (CVI)</td>
            </tr>
            <tr>
                <td>4</td>
                <td>LVD beneficiairies / Comprehensive Low Vision Evaluation - CLVE</td>
                <td></td>
                <td>Low vision assessment / Functional vision assessment done by a Professional - Optometrist / Low vision care specialist / Rehabilitation Specialist</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Assistive devices and aids</td>
                <td>Assistive devices / aids / RLF tactile books / Optical / Non Optical / Electronic</td>
                <td>Devices for individuals with low vision and total blindness</td>
            </tr>
            <tr>
                <td>6</td>
                <td>Low vision device training</td>
                <td>Training is given after dispensing devices</td>
                <td></td>
            </tr>
            <tr>
                <td>7</td>
                <td>Counseling & referrals / Counseling and education</td>
                <td>Education and counseling</td>
                <td>List of referrals</td>
            </tr>
            <tr>
                <td>8</td>
                <td>Orientation & Mobility training (O and M)</td>
                <td></td>
                <td>Training to help the visually impaired orient to the environment around and navigate safely</td>
            </tr>
            <tr>
                <td>9</td>
                <td>Computer training</td>
                <td></td>
                <td>Training programs are conducted to build proficiency in computer skills using assistive technology like screen readers, magnification and contrast modifications</td>
            </tr>
            <tr>
                <td>10</td>
                <td>Mobile technologies</td>
                <td></td>
                <td>Educating on various mobile app for navigation and other functions</td>
            </tr>
            <tr>
                <td>11</td>
                <td>Visual skills training</td>
                <td>All subtypes under it as a whole</td>
                <td>Visual skills training greater than 7 years and adults</td>
            </tr>
            <tr>
                <td>12</td>
                <td>Other training</td>
                <td>Corporate skill development</td>
                <td>Computer Programming, Digital accessibility testing DAT</td>
            </tr>
            <tr>
                <td>13</td>
                <td></td>
                <td>Braille Training & resources and Training with Braille reader / ORBIT reader</td>
                <td>Training on Braille devices for education and Braille literacy</td>
            </tr>
            <tr>
                <td>14</td>
                <td></td>
                <td>Training for Life skills/ Money identification / Home management / Kitchen skills</td>
                <td></td>
            </tr>
            <tr>
                <td>15</td>
                <td></td>
                <td>Job Coaching / IBPS</td>
                <td>Integrated training program for Institute of Banking Personnel Selection and other job coaching</td>
            </tr>
            <tr>
                <td>16</td>
                <td></td>
                <td>Spoken english training</td>
                <td>Training to speak in English for both beginners and Intermediate.</td>
            </tr>
            </tbody>
        </table>
    );
}

const ReferencePage = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Beneficiary Services Reference
            </Button>

            <ReactModal show={show} onHide={handleClose} size='xl'>
                <ReactModal.Header closeButton>
                <ReactModal.Title>Beneficiary Services Reference</ReactModal.Title>
                </ReactModal.Header>
                <ReactModal.Body>{renderReferencePage()}</ReactModal.Body>
                <ReactModal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </ReactModal.Footer>
            </ReactModal>
        </>
    );
};

export default ReferencePage;

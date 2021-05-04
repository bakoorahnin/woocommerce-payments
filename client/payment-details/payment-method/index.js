/** @format **/

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Loadable from 'components/loadable';
import CardDetails from './card';
import GiropayDetails from './giropay';
import SepaDetails from './sepa';
import SofortDetails from './sofort';

const PaymentDetailsPaymentMethod = ( { charge = {}, isLoading } ) => {
	let PaymentMethodDetails = CardDetails;
	if ( charge.payment_method_details && charge.payment_method_details.type ) {
		switch ( charge.payment_method_details.type ) {
			case 'giropay':
				PaymentMethodDetails = GiropayDetails;
				break;
			case 'sepa_debit':
				PaymentMethodDetails = SepaDetails;
				break;
			case 'sofort':
				PaymentMethodDetails = SofortDetails;
				break;
		}
	}
	return (
		<Card size="large">
			<CardHeader>
				<Loadable
					isLoading={ isLoading }
					value={ __( 'Payment method', 'woocommerce-payments' ) }
				/>
			</CardHeader>
			<CardBody>
				<PaymentMethodDetails
					isLoading={ isLoading }
					charge={ charge }
				/>
			</CardBody>
		</Card>
	);
};

export default PaymentDetailsPaymentMethod;

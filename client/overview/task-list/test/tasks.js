/** @format */

/**
 * Internal dependencies
 */
import { getTasks } from '../tasks';
import createAdditionalMethodsSetupTask from '../../../additional-methods-setup/task';

jest.mock( '../../../additional-methods-setup/task', () => jest.fn() );

describe( 'getTasks()', () => {
	it( 'should include business details when flag is set', () => {
		const actual = getTasks( {
			accountStatus: {
				status: 'restricted_soon',
				currentDeadline: 1620857083,
				pastDue: false,
				accountLink: 'http://example.com',
			},
			showUpdateDetailsTask: 'yes',
		} );

		expect( actual ).toEqual(
			expect.arrayContaining( [
				expect.objectContaining( {
					key: 'update-business-details',
					completed: false,
				} ),
			] )
		);
	} );

	it( 'should omit business details when flag is not set', () => {
		const actual = getTasks( {
			accountStatus: {
				status: 'restricted',
				currentDeadline: 1620857083,
				pastDue: true,
				accountLink: 'http://example.com',
			},
			showUpdateDetailsTask: 'no',
		} );

		expect( actual ).toEqual(
			expect.not.arrayContaining( [
				expect.objectContaining( {
					key: 'update-business-details',
				} ),
			] )
		);
	} );

	it( 'handles when account is complete', () => {
		const actual = getTasks( {
			accountStatus: {
				status: 'complete',
				currentDeadline: 0,
				pastDue: false,
				accountLink: 'http://example.com',
			},
			showUpdateDetailsTask: 'yes',
		} );

		expect( actual ).toEqual(
			expect.arrayContaining( [
				expect.objectContaining( {
					key: 'update-business-details',
					completed: true,
				} ),
			] )
		);
	} );

	it( 'adds WPCOM user reconnect task when the url is specified', () => {
		const actual = getTasks( {
			accountStatus: {
				status: 'complete',
			},
			wpcomReconnectUrl: 'http://example.com',
		} );

		expect( actual ).toEqual(
			expect.arrayContaining( [
				expect.objectContaining( {
					key: 'reconnect-wpcom-user',
					completed: false,
				} ),
			] )
		);
	} );

	it( 'should omit the WPCOM user reconnect task when the url is not specified', () => {
		const actual = getTasks( {
			accountStatus: {
				status: 'complete',
			},
			wpcomReconnectUrl: null,
		} );

		expect( actual ).toEqual(
			expect.not.arrayContaining( [
				expect.objectContaining( {
					key: 'reconnect-wpcom-user',
				} ),
			] )
		);
	} );

	describe( 'additional method setup task', () => {
		beforeEach( () => {
			createAdditionalMethodsSetupTask.mockReturnValue( {} );
			window.wcpaySettings = { additionalMethodsSetup: {} };
		} );

		afterEach( () => {
			jest.restoreAllMocks();
		} );

		it( 'renders task if `isTaskVisible` is true', () => {
			createAdditionalMethodsSetupTask.mockReturnValue( {
				key: 'woocommerce-payments--additional-payment-methods',
			} );

			const actual = getTasks( {
				additionalMethodsSetup: { isTaskVisible: true },
				accountStatus: {},
			} );

			expect( actual ).toEqual(
				expect.arrayContaining( [
					expect.objectContaining( {
						key: 'woocommerce-payments--additional-payment-methods',
					} ),
				] )
			);
		} );

		it( 'does not render task if `isTaskVisible` is false', () => {
			createAdditionalMethodsSetupTask.mockReturnValue( {
				key: 'woocommerce-payments--additional-payment-methods',
			} );

			const actual = getTasks( {
				additionalMethodsSetup: { isTaskVisible: false },
				accountStatus: {},
			} );

			expect( actual ).toEqual(
				expect.not.arrayContaining( [
					expect.objectContaining( {
						key: 'woocommerce-payments--additional-payment-methods',
					} ),
				] )
			);
		} );
	} );
} );

/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from '@testing-library/react';
import useLanguageQuery from './use-language-query';


jest.mock('./../../../i18n/index', () => {
	return {
		__esModule: true,
		i18n: {
			translations: { mock: { title: 'mock' }, foo: { title: 'bar' } },
			defaultLang: 'mock',
		},
	};
});

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		};
	},
}));
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

jest.mock('./use-selected-language', () => {
	return {
		__esModule: true,
		default: () => { },
	};
});

const useSelectedLanguage = jest.spyOn(
	require('./use-selected-language'),
	'default'
);

beforeEach(() => {
	useSelectedLanguage.mockImplementation(() => ({
		lang: 'mock',
	}));
});

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('The hook returns ', () => {
	it(`the query object with lang = forceLang if forceLang is passed `, async () => {
		const expectation = [
			{
				bar: 'baz',
				lang: 'forced',
			},
		];
		useRouter.mockImplementation(() => ({
			query: { bar: 'baz', lang: 'foo' },
		}));
		useSelectedLanguage.mockImplementation(() => ({
			lang: 'bar',
		}));

		const { result } = renderHook(() => useLanguageQuery('forced'));
		expect(result.current).toEqual(expectation);
	});

	it(`the query object with lang = selectedLanguage if no forceLang is passed and selectedLanguage is present`, async () => {
		const expectation = [
			{
				bar: 'baz',
				lang: 'bar',
			},
		];
		useRouter.mockImplementation(() => ({
			query: { bar: 'baz', lang: 'foo' },
		}));
		useSelectedLanguage.mockImplementation(() => ({
			lang: 'bar',
		}));

		const { result } = renderHook(() => useLanguageQuery());
		expect(result.current).toEqual(expectation);
	});

	it(`the query object with lang = lang if no forceLang is passed and no selectedLanguage is present`, async () => {
		const expectation = [
			{
				bar: 'baz',
				lang: 'foo',
			},
		];
		useRouter.mockImplementation(() => ({
			query: { bar: 'baz', lang: 'foo' },
		}));
		useSelectedLanguage.mockImplementation(() => ({
			lang: '',
		}));

		const { result } = renderHook(() => useLanguageQuery());
		expect(result.current).toEqual(expectation);
	});

	it(`an empty object if there is no query`, async () => {
		const expectation = [{}];
		useRouter.mockImplementation(() => ({
			query: null,
		}));
		useSelectedLanguage.mockImplementation(() => ({
			lang: '',
		}));

		const { result } = renderHook(() => useLanguageQuery());
		expect(result.current).toEqual(expectation);
	});
});
//

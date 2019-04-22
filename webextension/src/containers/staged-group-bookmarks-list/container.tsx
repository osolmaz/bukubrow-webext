import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Just } from 'purify-ts/Maybe';
import { AppState } from 'Store';
import { setStagedBookmarksGroupBookmarkEditId, deleteStagedBookmarksGroup } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';
import { getStagedGroupToEditWeightedBookmarks } from 'Store/selectors';
import StagedGroupBookmarksList from './staged-group-bookmarks-list';
import { deleteStagedBookmarksGroupBookmarkOrEntireGroup, openBookmarkAndExit } from 'Store/epics';
import { addAllBookmarksFromStagedGroup } from 'Store/epics';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarksListContainer: FC<Props> = props => (
	<StagedGroupBookmarksList
		bookmarks={props.bookmarks}
		onOpenBookmark={(bmId: LocalBookmark['id']) => {
			props.onOpenBookmark(bmId, props.stagedGroupId);
		}}
		onEditBookmark={(id) => {
			props.onEditBookmark(Just(id));
			props.setPage(Page.EditStagedBookmark);
		}}
		onDeleteBookmark={(id) => {
			props.stagedGroupId.ifJust((grpId) => {
				props.onDeleteBookmark(grpId, id);
			});
		}}
		onPublish={() => {
			props.stagedGroupId.ifJust((grpId) => {
				props.saveBookmarks(grpId);
				props.setPage(Page.StagedGroupsList);
			});
		}}
		onDeleteGroup={() => {
			props.stagedGroupId.ifJust((grpId) => {
				props.deleteGroup(grpId);
				props.setPage(Page.StagedGroupsList);
			});
		}}
	/>
);

const mapStateToProps = (state: AppState) => ({
	stagedGroupId: state.bookmarks.stagedBookmarksGroupEditId,
	bookmarks: getStagedGroupToEditWeightedBookmarks(state).orDefault([]),
});

const mapDispatchToProps = ({
	setPage,
	saveBookmarks: addAllBookmarksFromStagedGroup,
	deleteGroup: deleteStagedBookmarksGroup,
	onOpenBookmark: openBookmarkAndExit,
	onEditBookmark: setStagedBookmarksGroupBookmarkEditId,
	onDeleteBookmark: deleteStagedBookmarksGroupBookmarkOrEntireGroup,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksListContainer);